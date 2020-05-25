$version = "12.4.0"
$url = "https://nodejs.org/download/release/v$version/node-v$version-x86.msi"
$filename = "node.msi"
$node_msi = "$PSScriptRoot\$filename"

Write-Host "[NODE] downloading nodejs install"
Write-Host "url : $url"
$start_time = Get-Date
$wc = New-Object System.Net.WebClient
$wc.DownloadFile($url, $node_msi)
Write-Output "$filename downloaded"
Write-Output "Time taken: $((Get-Date).Subtract($start_time).Seconds) second(s)"

Start-Process -Wait -FilePath msiexec -ArgumentList /i, $node_msi, /quiet
npm i -g npm@latest
npm run bootstrap