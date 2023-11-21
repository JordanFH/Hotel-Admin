import React, {useEffect, useState} from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {Head, Link, useForm, usePage} from "@inertiajs/react";
import InputError from "@/Components/InputError";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackward, faEye, faFilePdf, faPlus, faPrint, faSave, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import CurrencyInput from "@/Components/CurrencyInput";
import Modal from "@/Components/Modal";
import axios from 'axios';


export default function Dashboard(props) {
    const {clientes, productos, servicios, detalle_cotizacion, user} = usePage().props;
    const fechaActual = new Date();
    const fechaString = fechaActual.getFullYear() + '-' + (fechaActual.getMonth() + 1).toString().padStart(2, '0') + '-' + fechaActual.getDate().toString().padStart(2, '0');

    //const user = props.auth.user; para encontrar el usuario logueado
    const [isChecked, setChecked] = useState(false);

    const {
        data: detalleCotizacionData,
        setData: setDetalleCotizacionData,
        post: postDetalleCotizacion,
        errors: errorsDetallePedido,
        processing: processingDetalleCotizacion
    } = useForm({
        tipo: 'Producto', item_id: "", precio_unitario: 0, cantidad: 1, monto: 0, stock: 0, description: "",ancho:1,alto:1,isChecked: false
    });

    function handlePedidoSubmit(e) {
        e.preventDefault();
        postPedido(route("cotizaciones.store"));
    }

    const clientesArray = clientes.data.map((cliente) => ({
        id: cliente.id, nombre: cliente.nombre,
    }));

    const productosArray = productos && productos.data ? productos.data.map((producto) => ({
        id: producto.id, nombre: producto.nombre, precio: producto.precio, stock: producto.stock,
    })) : [];

    const serviciosArray = servicios && servicios.data ? servicios.data.map((servicio) => ({
        id: servicio.id, nombre: servicio.nombre, precio: servicio.costo,
    })) : [];

    const detallesArray = detalle_cotizacion && detalle_cotizacion.data ? detalle_cotizacion.data.map((detalle) => {
        const elementoEncontrado = detalle.tipo === "Producto"
            ? productosArray.find(producto => producto.id === detalle.item_id)
            : serviciosArray.find(servicio => servicio.id === detalle.item_id);

        return {
            id: detalle.id,
            pedido_id: detalle.pedido_id,
            monto: detalle.monto,
            tipo: detalle.tipo,
            name: elementoEncontrado ? elementoEncontrado.nombre : "Elemento no encontrado",
            description: detalle.description,
        };
    }) : [];


    let totalGeneral = 0;
    detallesArray.forEach(detalle => {
        const totalDetalle = detalle.monto;
        totalGeneral += totalDetalle;
    });

    const {
        data: pedidoData, setData: setPedidoData, errors: errorsPedido, post: postPedido, processing: processingPedido
    } = useForm({
        cliente_id: "",
        fecha: fechaString,
        subtotal: totalGeneral/1.18,
        impuestos: (totalGeneral/1.18) * 0.18,
        descuento: 0,
        total: totalGeneral,
        monto_pagado: 0,
        estado: "Pendiente",
        descuentoCalculado: 0,
    });

    function roundToTwo(num) {
        // Usamos parseFloat para asegurarnos de que num sea tratado como un número.
        const multiplier = Math.pow(10, 2);
        const rounded = Math.round(num * multiplier) / multiplier;
        return isNaN(rounded) ? 0 : rounded; // Manejamos el caso de NaN si num no es un número válido.
    }

    useEffect(() => {

        // Calcula el descuento basado en el subtotal y el porcentaje de descuento
        const descuentoCalculado = (pedidoData.subtotal / 100) * pedidoData.descuento  ;
        console.log("descuentoCalculado", descuentoCalculado)
        // Calcula el nuevo subtotal después del descuento
        const nuevoSubtotal = (pedidoData.subtotal) - descuentoCalculado;
        console.log("nuevoSubtotal", nuevoSubtotal)

        // Calcula el nuevo IGV (Impuesto General a las Ventas) basado en el nuevo subtotal
        const nuevoIGV = nuevoSubtotal * 0.18;
        console.log("nuevoIGV", nuevoIGV)
        // Calcula el nuevo total sumando el nuevo subtotal y el nuevo IGV
        const totalAPagar = nuevoSubtotal + nuevoIGV;
        const descuentoTotal = descuentoCalculado + (pedidoData.subtotal*0.18 - nuevoIGV)
        console.log("totalAPagar", totalAPagar)
        console.log("suma : " + (descuentoTotal + nuevoSubtotal + nuevoIGV)) // la suma no da la misma, debido a que el igv bajo tambien debido al nuevo subtotal, esto es normal
        setPedidoData({
            ...pedidoData,
            impuestos: nuevoIGV,
            total: totalAPagar,
            descuentoCalculado: descuentoTotal
        });

        if (pedidoData.monto_pagado >= totalAPagar) {
            setPedidoData(prevData => ({...prevData, estado: "Cancelado"})); //estaba Cancelado
        } else {
            setPedidoData(prevData => ({...prevData, estado: "Pendiente"}));
        }

    }, [pedidoData.descuento, pedidoData.monto_pagado]);


    const [detallePedidos, setDetallePedidos] = useState(detallesArray);

    const [filteredData, setFilteredData] = useState(productosArray);


    const [options, setOptions] = useState(filteredData.map((item) => ({
        value: item.id, label: item.nombre, price: item.precio, stock: item.stock,
    })));
    const handleItems = (selectedValue) => {
        if (selectedValue === 'Producto') {
            setFilteredData(productosArray);
        } else {
            setFilteredData(serviciosArray);
        }
    };

    useEffect(() => {
        const updatedOptions = filteredData.map((item) => ({
            value: item.id, label: item.nombre, price: item.precio, stock: item.stock,
        }));
        //limpiar los campos
        setOptions(updatedOptions);

    }, [filteredData]);

    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const destroyDetalle = async (id) => {
        try {

            const response = await axios.delete(route("cotizaciondetalles.destroy", id));
            console.log("Respuesta de la solicitud DELETE:", response.data)
            // Después de eliminar el elemento, actualiza la lista de detalles filtrando el elemento eliminado.
            setDetallePedidos(prevDetallePedidos => prevDetallePedidos.filter(detalle => detalle.id !== response.data.id));


            //Actualizar stock

            if (response.data.tipo === "Producto") {
                const indexToUpdate = options.findIndex(item => item.value === parseInt(response.data.item_id));
                console.log("indexToUpdate", indexToUpdate)
                if (indexToUpdate !== -1) {
                    // Actualiza solo el elemento que cumple con el criterio.
                    setOptions(options.map(option => {
                        if (option.value === parseInt(response.data.item_id)) {
                            return {...option, stock: option.stock + response.data.cantidad};
                        }
                        return option;
                    }));
                }

            }

            // Actualiza los datos del pedido
            setPedidoData(prevData => ({
                ...prevData,
                subtotal: pedidoData.subtotal - response.data.monto / 1.18,
                impuestos: pedidoData.impuestos - response.data.monto / 1.18 * 0.18,
                total: pedidoData.total - response.data.monto,
            }));
            //window.location.reload();
        } catch (error) {
            // Manejar el error
            console.log(error);
        }
    };

    //hacer un useeffect para isChecked
    useEffect(() => {
        if(isChecked){
            setDetalleCotizacionData("isChecked", true);
        }else{
            setDetalleCotizacionData("isChecked", false);
        }
    },[isChecked]);

    async function handleDetallePedidoSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post(route("cotizaciondetalles.store"), detalleCotizacionData);
            const newDetalle = response.data;
            if (newDetalle === "el item_id es null") {
                console.log("el item_id es null");
            } else if (newDetalle === "el stock es 0") {
                console.log("el stock es 0");
            } else {
                // Convierte el nuevo detalle a formato deseado
                const itemId = parseInt(newDetalle.item_id);
                const elementoEncontrado = newDetalle.tipo === "Producto"
                    ? productosArray.find(producto => producto.id === itemId)
                    : serviciosArray.find(servicio => servicio.id === itemId);

                //Actualizar stock

                if (newDetalle.tipo === "Producto") {
                    const indexToUpdate = options.findIndex(item => item.value === parseInt(newDetalle.item_id));
                    console.log("indexToUpdate", indexToUpdate)
                    if (indexToUpdate !== -1) {
                        // Actualiza solo el elemento que cumple con el criterio.
                        setOptions(options.map(option => {
                            if (option.value === parseInt(newDetalle.item_id)) {
                                return {...option, stock: option.stock - newDetalle.cantidad};
                            }
                            return option;
                        }));
                    }

                }


                const newDetalleM = {
                    id: newDetalle.id,
                    pedido_id: newDetalle.pedido_id,
                    monto: newDetalle.monto,
                    tipo: newDetalle.tipo,
                    name: elementoEncontrado ? elementoEncontrado.nombre : "Elemento no encontrado",
                    description: newDetalle.description,
                };

                // Agrega el nuevo detalle a la lista de detalles
                const updated = [...detallePedidos, newDetalleM];
                setDetallePedidos(updated);

                // Actualiza los datos del pedido
                setPedidoData(prevData => ({
                    ...prevData,
                    subtotal: pedidoData.subtotal + newDetalleM.monto / 1.18,
                    impuestos: pedidoData.impuestos + newDetalle.monto / 1.18 * 0.18,
                    total: pedidoData.total + newDetalleM.monto,
                }));

            }

        } catch (error) {
            console.error(error);
        }
        setDetalleCotizacionData({
            tipo: 'Producto',
            precio_unitario: 0,
            cantidad: 1,
            monto: 0,
            stock: 0,
            description: "",
            ancho: 1,
            alto: 1,
            isChecked: false
        }); //elmonto a pagar es de prueba
        setChecked(false)
        setFilteredData(productosArray);
    }

    const openModalCreate = () => {
        setIsModalCreateOpen(true);
    };

    const closeModalCreate = () => {
        setIsModalCreateOpen(false);
    };

    // funcion para validar que la cantidad no sea mayor que el stock
    const [cantidadMsctock, setcantidadMsctok] = useState();

    useEffect(() => {
        if (detalleCotizacionData.cantidad > detalleCotizacionData.stock) {
            //mostrar mensaje
            setcantidadMsctok("La cantidad no puede ser mayor que el stock");
            setIsButtonDisabled(true)
        } else {
            setcantidadMsctok("");
            setIsButtonDisabled(false)
        }
    }, [detalleCotizacionData.cantidad]);


    function formatCurrency(amount) {
        return "S/. " + amount.toLocaleString("es-PE", {
            minimumFractionDigits: 2, maximumFractionDigits: 2,
        });
    }

    function sinIGV(amount) {
        const result = amount / 1.18;
        return parseFloat(result.toFixed(2));
    }

    // funcion para validar que el item_id no sea null
    function itemIsNull() {
        console.log("useEffect:", detalleCotizacionData.item_id)
        if(detalleCotizacionData.item_id != null){
            setDetalleCotizacionData("monto", detalleCotizacionData.precio_unitario * detalleCotizacionData.cantidad*detalleCotizacionData.ancho*detalleCotizacionData.alto);
        }
        return detalleCotizacionData.item_id === null || detalleCotizacionData.item_id === "";
    }

    // useeffect para validar que el item_id no sea null
    useEffect(() => {
        setIsButtonDisabled(itemIsNull());
    }, [detalleCotizacionData.item_id]);

    function handleCheckboxChange() {
        setChecked(!isChecked);

    }

    return (<Authenticated
        auth={props.auth}
        errors={props.errors}
        header={<h2 className="sm:ml-0 ml-3 font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Agregar Cotización
        </h2>}
    >
        <Head title="Pedidos"/>

        <div className="py-8">
            <div className="max-w-8xl mx-auto px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="flex items-center justify-between mb-6">
                            <Link
                                className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none"
                                href={route("cotizaciones.index")}
                            >
                                <FontAwesomeIcon
                                    icon={faBackward}
                                    className="mr-2"
                                />
                                Regresar
                            </Link>
                            <br/>
                            <div className="flex justify-between space-x-4">
                                <a type="button"
                                   href={route("cotizaciones.report")}
                                        className="text-rose-500 hover:text-white border border-rose-500 hover:bg-rose-500 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-rose-500 dark:text-rose-500 dark:hover:text-white dark:hover:bg-rose-500">
                                    <FontAwesomeIcon icon={faPrint} className="md:mr-2 mr-0"/>
                                    <span className="md:inline-block hidden">Imprimir</span>
                                </a>
                            </div>
                        </div>

                        <form name="createForm" onSubmit={handlePedidoSubmit}>
                            <div className="lg:flex block">
                                <div className="flex flex-col w-full mr-4">
                                    <div className="mb-4">
                                        <label className="text-gray-900 dark:text-gray-100">
                                            Cliente
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <select
                                            name="cliente_id"
                                            onChange={(e) => {
                                                setPedidoData((prevData) => ({
                                                    ...prevData, cliente_id: e.target.value
                                                }));
                                                setDetalleCotizacionData("cliente_id", e.target.value);
                                            }}

                                            value={pedidoData.cliente_id}
                                            className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            <option value="">
                                                Seleccionar
                                            </option>
                                            {clientesArray
                                                .map(({id, nombre}) => (<option key={id} value={id}>
                                                    {nombre}
                                                </option>))}
                                        </select>
                                        <InputError
                                            message={errorsPedido.cliente_id}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="mb-4">
                                        <label className="text-gray-900 dark:text-gray-100">
                                            Usuario
                                        </label>
                                        <input
                                            type="text"
                                            className="cursor-not-allowed mt-1 w-full border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            label="Nombre y Apellidos"
                                            name="usuario_id"
                                            autoFocus
                                            disabled={true}
                                            value={
                                                props.auth.user.name
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="mb-4">
                                    <label className="text-gray-900 dark:text-gray-100">
                                        Fecha
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        label="Fecha"
                                        name="fecha"
                                        value={pedidoData.fecha}
                                        onChange={(e) => setPedidoData("fecha", e.target.value)}
                                    />
                                    <InputError
                                        message={errorsPedido.fecha}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="mb-16">
                                    <label className="text-gray-900 dark:text-gray-100">
                                        Detalle de la cotización
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>

                                    <div
                                        className="rounded-lg border border-gray-300 dark:border-gray-700 relative overflow-x-auto">
                                        <table className="w-full border-collapse table-fixed">
                                            <thead>
                                            <tr className="border-b border-gray-300 dark:border-gray-700 dark:bg-gray-900 bg-gray-200">
                                                <th className="uppercase text-center border-r border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-4 py-3 w-5">
                                                    N°
                                                </th>
                                                <th className="uppercase border-r border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-4 py-3 w-60">
                                                    Producto / Servicio
                                                </th>
                                                <th className="uppercase text-center border-r border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-4 py-3 w-20">
                                                    Monto con IGV
                                                </th>
                                                <th className="uppercase text-center border-r border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-4 py-3 w-20">
                                                    Monto Sin IGV
                                                </th>
                                                <th className="uppercase text-center border-r border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-4 py-3 w-40">
                                                    Descripción
                                                </th>
                                                <th className="uppercase border-r border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-3 py-3 w-20">
                                                    Quitar
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {detallePedidos.map(({id, tipo, monto, name,description}, index) => (<tr
                                                className="[&:not(:last-child)]:border-b dark:border-gray-700 border-gray-300"
                                                key={index}
                                            >
                                                <td className="border-r text-center dark:border-gray-700 border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-100">
                                                    {index + 1}
                                                </td>
                                                <td className="border-r truncate dark:border-gray-700 border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-100">
                                                    {
                                                        name
                                                    }
                                                </td>
                                                <td className="border-r text-center truncate dark:border-gray-700 border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(monto)}
                                                </td>
                                                <td className="border-r text-center truncate dark:border-gray-700 border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-100">
                                                    {sinIGV(monto)}
                                                </td>
                                                <td className="border-r text-center truncate dark:border-gray-700 border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-100">
                                                    {description}
                                                </td>

                                                <td className="text-center dark:border-gray-700 border-gray-300 px-4 py-2">
                                                    <button
                                                        onClick={() => {
                                                            console.log("id", id);
                                                            destroyDetalle(id);
                                                        }}
                                                        /*disabled={isButtonDisabled}*/
                                                        tabIndex="-1"
                                                        type="button"
                                                        className={`w-15 sm:w-auto m-1 px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:text-red-500 hover:dark:text-red-500`}
                                                    >
                                                        <FontAwesomeIcon
                                                            className="text-base"
                                                            icon={faTrashAlt}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>))}
                                            {detallePedidos.length === 0 && (<tr>
                                                <td
                                                    className="px-6 py-4 text-center px-4 py-2 text-gray-900 dark:text-gray-100"
                                                    colSpan="5"
                                                >
                                                    No hay items agregados.
                                                </td>
                                            </tr>)}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={() => {
                                                /*setIdSeleccionado(
                                                    id
                                                );
                                                setItemSeleccionado(
                                                    nombre
                                                );*/
                                                openModalCreate();
                                            }}
                                            tabIndex="-1"
                                            type="button"
                                            className="px-6 py-3 text-white bg-purple-500 rounded-full focus:outline-none hover:bg-purple-600"
                                        >
                                            Nuevo
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                className="ml-2"
                                                beat={true}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:flex block">
                                <div className="flex flex-col w-full mr-4">
                                    <div className="mb-4">
                                        <label className="text-gray-900 dark:text-gray-100">
                                            Descuento (%)
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            value={pedidoData.descuento}
                                            onChange={(e) => {
                                                // Validar que el valor esté dentro del rango de 0 a 100
                                                const inputValue = e.target.value;
                                                if (inputValue === "" || (Number(inputValue) >= 0 && Number(inputValue) <= 100)) {
                                                    setPedidoData({
                                                        'cliente_id': pedidoData.cliente_id,
                                                        'monto_pagado': pedidoData.monto_pagado,
                                                        'fecha': fechaString,
                                                        "descuento": inputValue,
                                                        "subtotal": pedidoData.subtotal,
                                                        "descuentoCalculado": pedidoData.descuentoCalculado,
                                                        "impuestos": pedidoData.impuestos,
                                                        "total": pedidoData.total
                                                    });
                                                }
                                            }}
                                            required
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            onKeyPress={(e) => {
                                                // Check if the key pressed is not a natural number
                                                if (e.key === "." || e.key === "-" || e.key === ",") {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                        <InputError
                                            message={errorsPedido.descuento}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="mb-4">
                                        <label className="text-gray-900 dark:text-gray-100">
                                            Subtotal (Soles){roundToTwo(pedidoData.subtotal)}
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <CurrencyInput
                                            placeholder="0.00"
                                            value={
                                                roundToTwo(pedidoData.total - pedidoData.impuestos)
                                            }
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                setPedidoData("subtotal", inputValue.replace(",", ""));
                                            }}
                                            required
                                            disabled={true}
                                            type="text"
                                            className="cursor-not-allowed mt-1 w-full border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        />
                                        <InputError
                                            message={errorsPedido.subtotal}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-gray-900 dark:text-gray-100">
                                            IGV (Soles)
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <CurrencyInput
                                            placeholder="0.00"
                                            value={roundToTwo(pedidoData.impuestos)}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                setPedidoData("impuestos", inputValue.replace(",", ""));
                                            }}
                                            required
                                            disabled={true}
                                            type="text"
                                            className="cursor-not-allowed mt-1 w-full border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        />
                                        <InputError
                                            message={errorsPedido.impuestos}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-gray-900 dark:text-gray-100">
                                            Descuento (Soles){roundToTwo(pedidoData.descuentoCalculado)}
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        {
                                        }
                                        <CurrencyInput
                                            placeholder="0.00"
                                            value={roundToTwo(pedidoData.descuentoCalculado)}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                setPedidoData("descuentoCalculado", inputValue.replace(",", ""));
                                            }}
                                            required
                                            disabled={true}
                                            type="text"
                                            className="cursor-not-allowed mt-1 w-full border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        />
                                        <InputError
                                            message={errorsPedido.descuentoCalculado}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-gray-900 dark:text-gray-100">
                                            TOTAL (Soles){pedidoData.total}
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <CurrencyInput
                                            placeholder="0.00"
                                            value={roundToTwo(pedidoData.total)}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                setPedidoData("total", inputValue.replace(",", ""));
                                            }}
                                            required
                                            disabled={true}
                                            type="text"
                                            className="cursor-not-allowed mt-1 w-full border-2 border-blue-500 dark:border-blue-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-black rounded-md shadow-sm"
                                        />
                                        <InputError
                                            message={errorsPedido.total}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    disabled={processingPedido}
                                    className={`px-7 py-2 font-bold text-white bg-green-500 hover:bg-green-600 rounded ${processingPedido && "opacity-25"}`}
                                >
                                    <FontAwesomeIcon
                                        icon={faSave}
                                        className="mr-2"
                                    />
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <Modal
            show={isModalCreateOpen}
            onClose={closeModalCreate}
        >
            <form onSubmit={handleDetallePedidoSubmit}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div>
                        <div
                            className="mt-3 text-center sm:mt-0 sm:text-left">
                            <div className="sm:flex items-center">
                                <div className="mr-2">
                                    <div
                                        className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            className="text-purple-700"
                                        />
                                    </div>
                                </div>
                                <h3 className="sm:mt-0 mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Añadiendo Producto / Servicio
                                </h3>
                            </div>

                            <div className="mt-4">
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    A continuación vamos a añadir un nuevo
                                    producto o servicio al pedido.
                                </p>
                            </div>
                            <div className="text-left">
                                <div className="mt-4">
                                    <label
                                        className="text-gray-900 dark:text-gray-100">
                                        Tipo de Pedido
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <select
                                        value={detalleCotizacionData.tipo}
                                        onChange={(e) => {
                                            const newItemType = e.target.value;
                                            const updatedData = {
                                                ...detalleCotizacionData,
                                                tipo: newItemType,
                                                item_id: "" // Restablecer item_id si es necesario
                                            };
                                            setChecked(false)
                                            setDetalleCotizacionData(updatedData);
                                            handleItems(newItemType);
                                        }}
                                        className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        autoFocus
                                    >
                                        <option value="Producto">Producto
                                        </option>
                                        <option value="Servicio">Servicio
                                        </option>
                                    </select>
                                    <InputError
                                        message={errorsDetallePedido.tipo}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label
                                        className="text-gray-900 dark:text-gray-100">
                                        Producto / Servicio
                                    </label>
                                    <select
                                        value={detalleCotizacionData.item_id}
                                        onChange={(e) => {
                                            const selectedOption = options.find((option) => option.value === parseInt(e.target.value));
                                            console.log("cantidad", parseFloat(detalleCotizacionData.cantidad));
                                            console.log("precio", parseFloat(selectedOption.price));

                                            const newDetallePedidoData = {
                                                ...detalleCotizacionData, // Copiar todas las propiedades existentes
                                                monto: parseFloat(selectedOption.price) * parseFloat(detalleCotizacionData.cantidad),
                                                item_id: e.target.value,
                                                precio_unitario: parseFloat(selectedOption.price),
                                                stock: selectedOption.stock
                                            };

                                            setDetalleCotizacionData(newDetallePedidoData);
                                        }}
                                        className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    >
                                        <option value="">
                                            Seleccionar
                                        </option>
                                        {options
                                            .map(({value, label}) => (<option key={value} value={value}>
                                                {label}
                                            </option>))}
                                    </select>
                                    <InputError
                                        message={errorsDetallePedido.item_id}
                                        className="mt-2"
                                    />
                                </div>
                                {
                                    detalleCotizacionData.tipo === "Servicio" && (<div className="mt-4">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={handleCheckboxChange}
                                            />
                                        <label
                                            className="text-gray-900 dark:text-gray-100">
                                              Calcular ancho y alto (Banner)
                                        </label>
                                    </div>
                                       )

                                }

                                <div className="flex justify-between mt-4">
                                    <div className="w-full">
                                        <label className="text-gray-900 dark:text-gray-100">
                                            Cantidad
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            value={detalleCotizacionData.cantidad.toString()}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                let newCantidad = 0;

                                                if (inputValue !== "") {
                                                    // Si hay un valor, intentamos convertirlo a número
                                                    const parsedValue = parseFloat(inputValue.replace(",", ""));

                                                    if (!isNaN(parsedValue)) {
                                                        // Si es un número válido, lo asignamos a newCantidad
                                                        newCantidad = parsedValue;
                                                    }
                                                }

                                                // Calculamos el nuevo monto en función de newCantidad
                                                const newMonto = newCantidad * parseFloat(detalleCotizacionData.precio_unitario)* parseFloat(detalleCotizacionData.ancho)* parseFloat(detalleCotizacionData.alto);

                                                const newDetallePedidoData = {
                                                    ...detalleCotizacionData,
                                                    cantidad: newCantidad,
                                                    monto: newMonto,
                                                };

                                                setDetalleCotizacionData(newDetallePedidoData);


                                            }}
                                            required
                                            type="number" // Cambiado de "number" a "text"
                                            className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            onKeyPress={(e) => {
                                                // Permitir números, comas y puntos
                                                const allowedCharacters = /[0-9]*([,.][0-9]+)?/;
                                                if (!allowedCharacters.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                        <InputError message={cantidadMsctock} className="mt-2"/>
                                    </div>
                                    {
                                        detalleCotizacionData.tipo === "Producto" && (<div className="ml-2">
                                            <label className="text-gray-900 dark:text-gray-100">
                                                Stock
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                value={detalleCotizacionData.stock}
                                                disabled={true}
                                                type="text" // Cambiado de "number" a "text"
                                                className="cursor-not-allowed mt-1 w-full border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            />
                                        </div>)

                                    }
                                    {
                                        isChecked && (<div className="ml-2">
                                            <label className="text-gray-900 dark:text-gray-100">
                                                Ancho
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <CurrencyInput
                                                placeholder="0"
                                                value={detalleCotizacionData.ancho}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;
                                                    // Verifica si el valor está vacío y establece cero en su lugar
                                                    const newValueancho =  inputValue.replace(",", "");
                                                    let newMonto = newValueancho * parseFloat(detalleCotizacionData.alto) * parseFloat(detalleCotizacionData.precio_unitario);

                                                    //setDetalleCotizacionData("precio_unitario", newValue);
                                                    const newDetallePedidoData = {
                                                        ...detalleCotizacionData,
                                                        ancho: newValueancho,
                                                        monto: newMonto,
                                                    };
                                                    setDetalleCotizacionData(newDetallePedidoData);

                                                }}
                                                type="text"
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            />
                                            <InputError
                                                message={errorsDetallePedido.ancho}
                                                className="mt-2"
                                            />
                                            <label className="text-gray-900 dark:text-gray-100">
                                                Alto
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <CurrencyInput
                                                placeholder="0"
                                                value={detalleCotizacionData.alto}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;
                                                    // Verifica si el valor está vacío y establece cero en su lugar
                                                    const newValuealto = inputValue.replace(",", "");
                                                    let newMonto = newValuealto * parseFloat(detalleCotizacionData.precio_unitario)* parseFloat(detalleCotizacionData.ancho);
                                                    //setDetalleCotizacionData("precio_unitario", newValue);

                                                    const newDetallePedidoData = {
                                                        ...detalleCotizacionData,
                                                        alto: newValuealto,
                                                        monto: newMonto,
                                                    };

                                                    setDetalleCotizacionData(newDetallePedidoData);

                                                }}
                                                type="text"
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            />
                                            <InputError
                                                message={errorsDetallePedido.alto}
                                                className="mt-2"
                                            />
                                            <label className="text-gray-900 dark:text-gray-100">
                                                Área: {(detalleCotizacionData.ancho * detalleCotizacionData.alto).toFixed(2)} m2
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                        </div>)


                                    }
                                </div>
                                <div className="mt-4">
                                    <label className="text-gray-900 dark:text-gray-100">
                                        Precio Unitario (Soles)
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>

                                    <CurrencyInput
                                        placeholder=""
                                        value={detalleCotizacionData.precio_unitario}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            // Verifica si el valor está vacío y establece cero en su lugar
                                            const newValue = inputValue === "" ? "0" : inputValue.replace(",", "");
                                            let newMonto = newValue * parseFloat(detalleCotizacionData.cantidad) * parseFloat(detalleCotizacionData.ancho) * parseFloat(detalleCotizacionData.alto);
                                            //setDetalleCotizacionData("precio_unitario", newValue);

                                            const newDetallePedidoData = {
                                                ...detalleCotizacionData,
                                                precio_unitario: newValue,
                                                monto: newMonto,
                                            };

                                            setDetalleCotizacionData(newDetallePedidoData);

                                        }}
                                        required
                                        type="text"
                                        className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    />
                                    <InputError
                                        message={errorsDetallePedido.precio_unitario}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="text-gray-900 dark:text-gray-100">
                                        Monto (Soles)
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <CurrencyInput
                                        placeholder="0.00"
                                        value={detalleCotizacionData.monto}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            setDetalleCotizacionData("monto", inputValue.replace(",", ""));
                                        }}
                                        required
                                        disabled={true}
                                        type="text"
                                        className="cursor-not-allowed mt-1 w-full border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    />
                                    <InputError
                                        message={errorsDetallePedido.monto}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="text-gray-900 dark:text-gray-100">
                                        Descripción
                                    </label>
                                    <textarea
                                        className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        label="description"
                                        name="description"
                                        autoFocus
                                        value={ detalleCotizacionData.description}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 255) {
                                                console.log("e.target.value", e.target.value);
                                                setDetalleCotizacionData("description", e.target.value);
                                            }
                                        }
                                    }
                                    />
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="mt-1 mb-3 px-4 py-3 pb-4 sm:px-6 sm:flex sm:flex-row-reverse justify-center">
                    <button
                        type="submit"
                        disabled={isButtonDisabled}
                        onClick={() => {
                            // Recargar la página
                            closeModalCreate();
                        }}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm ${isButtonDisabled && "opacity-25"}`}
                    >
                        Aceptar
                    </button>
                    <button
                        onClick={() => {

                            closeModalCreate();
                        }}
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </Modal>
    </Authenticated>);
}
