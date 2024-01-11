<powershell>
# Enable the Ping Firewall rule
Set-NetFirewallRule -Name "FPS-ICMP4-ERQ-In" -ErrorAction SilentlyContinue -Enabled True
# Create RDP User
Set-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" -name "ConsentPromptBehaviorAdmin"  -value "0"
Set-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" -name "EnableLUA" -value "0"
Set-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" -name "PromptOnSecureDesktop" -value "0"
Start-Process -FilePath "net" -ArgumentList "user testuser Test123! /add" -Verb runAs
Start-Process -FilePath "net" -ArgumentList "localgroup Administrators testuser /add" -Verb runAs
</powershell>