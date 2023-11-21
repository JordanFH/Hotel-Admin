@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="https://laravel.com/img/notification-logo.png" class="logo" alt="Laravel Logo">
@else
<img src="https://drive.google.com/uc?export=view&id=1Q9RjObimbmA9yujk7Tzkq4pQ-6pGVzlm" class="logo" alt="">
<br>
{{ $slot }}
@endif
</a>
</td>
</tr>
