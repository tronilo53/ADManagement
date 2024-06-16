#Importarcion de Active Directory
Import-Module ActiveDirectory
[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8

function addUsers {
    param($pathOU)
    <#
    $newPathFile = @("Ous")
        $canonical = @(Get-ADOrganizationalUnit -Properties CanonicalName -Filter * | Sort-Object CanonicalName | Select-Object CanonicalName, DistinguishedName)
        foreach($can in $canonical) {
            if($can.DistinguishedName -eq $pathOU) {
                $pathFile = @($can.CanonicalName -split "/")
                foreach($path in $pathFile) {
                    if($path -ne "eu.hsi.local" -and $path -ne "ES" -and $path -ne "Usuarios Henry Schein SPAIN") {
                        $newPathFile = $newPathFile += $path
                    }
                }
                Write-Host ""
                $joinedNewPath = $newPathFile -join "/"
                $pathComplete = $joinedNewPath + "/users.csv"
                Write-Host "*Se ejecutara el archivo de la ruta: '"$pathComplete"'"
                Write-Host ""
            }
        }
    #>
    
    
    <#for ($i = 0; $i -lt $ousRoot.Length; $i++) {
        $plus = $i + 1
        $nameOU = $ousRoot[$i].Name
        Write-Host "$plus) $nameOU"
    }
    
    
    param ($path, $pathOU)
    $pathNew = "./" + $path
    $users = Import-Csv $pathNew -Delimiter ";"
    foreach($user in $users) {
        $samAccountName = $user.nombre + "." + $user.apellidos
        if(Get-ADuser -Filter {SamAccountName -eq $samAccountName}) {
            Write-Warning "La cuenta '"$samAccountName"' Ya existe y no se creara"
        }else {
            try {
                $userPrincipalName = $user.SamAccountName + "@" + $user.Upn
                $uname = $user.apellidos + ", " + $user.nombre
                $manager = Get-ADuser -Identity $user.manager | Select-Object DistinguishedName
                $object = @{
                    Name = $uname
                    DisplayName = $uname
                    GivenName = $user.nombre
                    Surname = $user.apellidos
                    Department = $user.departamento
                    Title = $user.puestoTrabajo
                    UserPrincipalName = $userPrincipalName
                    SamAccountName = $samAccountName
                    Company = $user.compania
                    Office = $user.oficina
                    Manager = $manager[0].DistinguishedName
                    Path = $pathOU
                    EmailAddress = $userPrincipalName
                    Description = $user.puestoTrabajo
                    AccountPassword = $user.contrasena
                }
                
                New-ADUser -Name $uname `
                -DisplayName $uname `
                -GivenName $user.nombre `
                -Surname $user.apellidos `
                -Department $user.departamento `
                -Title $user.puestoTrabajo `
                -UserPrincipalName $userPrincipalName `
                -SamAccountName $samAccountName `
                -Company $user.compania `
                -Office $user.oficina `
                -Manager $manager[0].DistinguishedName `
                -Path $pathOU `
                -EmailAddress $userPrincipalName `
                -Description $user.puestoTrabajo `
                -AccountPassword (ConvertTo-SecureString $user.contrasena -AsPlainText -Force) -Enabled $true -ChangePasswordAtLogon $false -PasswordNeverExpires $false -Verbose
                Set-ADuser -Identity $samAccountName -Replace @{'extensionAttribute10'='EMEAadministration'}
                Write-Host -ForegroundColor Green -BackgroundColor White "Usuario Creado correctamente"
                
                Write-Warning $object
            }
            catch {
                Write-Warning "Error al crear el usuario: '"$samAccountName"' Error: "$error[0]
            }
        }
    }#>
}
$get = {param([string]$pathOU,[int]$indent = 2)
    $ous = Get-ADOrganizationalUnit -LDAPFilter '(name=*)' -SearchBase $pathOU -SearchScope OneLevel | Select-Object Name, DistinguishedName
    foreach ($child in $ous) {
      $tab = "-" * $indent
      "|{0} {1}" -f $tab, $child.Name
      &$get -pathOU $child.distinguishedname -indent ($indent+=2)
      $indent-=2
    }
  }

  (Get-ADDomain).Name;invoke-command $get -ArgumentList "OU=Usuarios Henry Schein SPAIN,OU=ES,DC=eu,DC=hsi,DC=local"