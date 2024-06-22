#Importarcion de Active Directory
Import-Module ActiveDirectory
[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8

$get = {param([string]$pathOU)
    $ous = @(Get-ADOrganizationalUnit -LDAPFilter '(name=*)' -SearchBase $pathOU -SearchScope OneLevel | Select-Object Name, DistinguishedName)
    $result = @()
    foreach ($ou in $ous) {
        $children = @(&$get -pathOU $ou.DistinguishedName)
        $childrenArray = if($children.Count -gt 0) {
            $children
        }else {
            Write-Output []
        }
        $result += [PSCustomObject]@{
            label = $ou.Name
            data = $ou.DistinguishedName
            expandedIcon = "pi pi-folder-open"
            collapsedIcon = "pi pi-folder"
            children = $childrenArray
        }
    }
    return $result
}

$json = invoke-command $get -ArgumentList "OU=Usuarios Henry Schein SPAIN,OU=ES,DC=eu,DC=hsi,DC=local" | ConvertTo-Json -Depth 10
Write-Output $json