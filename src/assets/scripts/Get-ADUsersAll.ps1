# Ajustar la codificación de salida para asegurar UTF-8
[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8

# Define las propiedades que deseas obtener
$properties = @("SamAccountName", "DisplayName", "Title", "Department", "UserPrincipalName", "DistinguishedName", "Enabled", "LockedOut", "Office", "Company")


# Obtiene todos los usuarios del Active Directory
$users = Get-ADUser -Filter * -Property $properties -SearchBase "DC=eu, DC=hsi, DC=local"

# Selecciona solo las propiedades deseadas
$selectedUsers = $users | Select-Object $properties

# Convierte los resultados a formato JSON
$json = $selectedUsers | ConvertTo-Json -Depth 10

# Guarda el JSON en un archivo
$json | Out-File -FilePath "C:\temp\users.json" -Encoding UTF8
