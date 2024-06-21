param([string]$email)

# Ajustar la codificación de salida para asegurar UTF-8
[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8

# Obtener el usuario de Active Directory
$user = Get-ADUser -Filter {EmailAddress -eq $email} -Properties DistinguishedName

# Verificar si se encontró un usuario válido
if ($user -eq $null) {
    Write-Output "Usuario no encontrado en Active Directory."
} else {
    # Obtener el DistinguishedName del usuario, si está presente
    $distinguishedName = $user.DistinguishedName

    if ($distinguishedName) {
        # Convertir el resultado a JSON con formato adecuado
        $jsonResult = @{
            DistinguishedName = $distinguishedName
        } | ConvertTo-Json -Depth 1 -Compress

        # Imprimir el resultado JSON
        Write-Output $jsonResult
    } else {
        Write-Output "No se encontró DistinguishedName para el usuario con correo electrónico '$email'."
    }
}