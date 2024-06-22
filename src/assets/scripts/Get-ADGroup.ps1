param([string]$distinguishedName)

# Ajustar la codificación de salida para asegurar UTF-8
[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8

$groups = Get-ADGroup -Filter "Members -eq '$distinguishedName'"

$groupsList = @()

foreach ($group in $groups) {
    $groupsList += [PSCustomObject]@{
        DistinguishedName = $group.DistinguishedName
    }
}

write-Output $groupsList | ConvertTo-Json -Depth 10 -Compress