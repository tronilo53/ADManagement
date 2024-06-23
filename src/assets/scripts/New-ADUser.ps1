param (
    [Parameter(Mandatory=$true)]
    [string]$MyObject
)

[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8

$userData = $MyObject | ConvertFrom-Json
$filter = "SamAccountName -eq '$($userData.SamAccountName)'"

if(Get-ADuser -Filter $filter) {
    Write-Output "La cuenta '$($userData.SamAccountName)' Ya existe y no se creara"
}else {
    try {
        $newADUser = New-ADUser -Name $userData.Name `
         -DisplayName $userData.DisplayName `
         -GivenName $userData.GivenName `
         -Surname $userData.Surname `
         -Department $userData.Department `
         -Title $userData.Title `
         -UserPrincipalName $userData.UserPrincipalName `
         -SamAccountName $userData.SamAccountName `
         -Company $userData.Company `
         -Office $userData.Office `
         -Manager $userData.Manager `
         -Path $userData.Path `
         -EmailAddress $userData.EmailAddress `
         -Description $userData.Description `
         -AccountPassword (ConvertTo-SecureString $userData.AccountPassword -AsPlainText -Force) -Enabled $true -ChangePasswordAtLogon $false -PasswordNeverExpires $false -Verbose
         #Set-ADuser -Identity $userData.SamAccountName -Replace @{'extensionAttribute10'='EMEAadministration'}
         Set-ADuser -Identity $userData.SamAccountName -Replace @{'msDS-cloudExtensionAttribute10'='EMEAadministration'}
        foreach($group in $userData.Groups) {
            Add-ADGroupMember -Identity $group.DistinguishedName -Members $userData.SamAccountName -Verbose
        }

         Write-Output "El usuario se ha creado correctamente"
    }catch {
        $createdUser = Get-ADUser -Filter $filter -ErrorAction SilentlyContinue
        if ($createdUser) {
            Remove-ADUser -Identity $createdUser -Confirm:$false -Verbose
        }
        Write-Output 'Ha habido un error al crear el usuario en AD'
    }
}