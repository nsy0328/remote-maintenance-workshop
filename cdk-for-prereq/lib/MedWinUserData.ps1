<powershell>
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Set-Service -Name sshd -StartupType 'Automatic'
Start-Service -Name sshd
Move-Item "${Env:ProgramData}\ssh\sshd_config" "${Env:ProgramData}\ssh\sshd_config.original"
$data = "PubkeyAuthentication yes"
$data += "`n" + "PasswordAuthentication no"
Out-File -FilePath "${Env:ProgramData}\ssh\sshd_config" -InputObject $data -Encoding ascii
New-Item -Path "${Env:USERPROFILE}" -Name ".ssh" -ItemType Directory
$token = Invoke-RestMethod 'http://169.254.169.254/latest/api/token' -Method Put -Headers @{ "X-aws-ec2-metadata-token-ttl-seconds" = 21600 }
Invoke-RestMethod -Uri "http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key" -Headers @{ "X-aws-ec2-metadata-token" = $token } -OutFile "${Env:USERPROFILE}\.ssh\authorized_keys"
# Confirm the SSH Firewall rule is configured. It should be created automatically by setup. Run the following to verify
if (!(Get-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -ErrorAction SilentlyContinue | Select-Object Name, Enabled)) {
  Write-Output "Firewall Rule 'OpenSSH-Server-In-TCP' does not exist, creating it..."
  New-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
} else {
  Write-Output "Firewall rule 'OpenSSH-Server-In-TCP' has been created and exists."
}
# Enable the Ping Firewall rule
Set-NetFirewallRule -Name "FPS-ICMP4-ERQ-In" -ErrorAction SilentlyContinue -Enabled True
Restart-Service -Name sshd
</powershell>