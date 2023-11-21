<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Imprimir Detalles</title>
</head>
<body>
<h1>Cotización
    @if(isset($cot))
        {{ $cot->id }}
    @endif
</h1>
<h1></h1>
@if (!empty($cotizaciones))
    <table class="table table-bordered">
        <thead>
        <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Nombre</th>
            <th>Monto</th>
            <th>Cantidad</th>
        </tr>
        </thead>
        <tbody>
        @foreach($cotizaciones as $cotizacion)
            <tr>
                <td>{{ $cotizacion->id }}</td>
                <td>{{ $cotizacion->tipo }}</td>
                @if($cotizacion->tipo == 'Producto')
                    <td>{{ $productos->where('id', $cotizacion['item_id'])->first()['nombre'] }}</td>
                @else
                    <td>{{ $servicios->where('id', $cotizacion['item_id'])->first()['nombre'] }}</td>
                @endif
                <td>{{ $cotizacion->monto }}</td>
                <td>{{ $cotizacion->cantidad }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
@else
    <p>No hay cotizaciones disponibles.</p>
@endif

</body>
</html>
