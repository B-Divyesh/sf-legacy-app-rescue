$ErrorActionPreference = "Stop"
$repo = "B-Divyesh/sf-legacy-app-rescue"
$base = "https://github.com/$repo/releases/latest/download"
$file = "rescue-windows-x86_64.zip"
$rescueTemp = Join-Path ([System.IO.Path]::GetTempPath()) ("legacy-app-rescue-" + [guid]::NewGuid())
$installDir = Join-Path $env:LOCALAPPDATA "Programs\LegacyAppRescue"
New-Item -ItemType Directory -Path $rescueTemp | Out-Null
try {
  Invoke-WebRequest "$base/$file" -OutFile (Join-Path $rescueTemp $file)
  Invoke-WebRequest "$base/SHA256SUMS" -OutFile (Join-Path $rescueTemp "SHA256SUMS")
  $line = Get-Content (Join-Path $rescueTemp "SHA256SUMS") | Where-Object { $_ -match "\s$file$" } | Select-Object -First 1
  if (-not $line) { throw "Checksum for $file is missing." }
  $expected = ($line -split "\s+")[0].ToLowerInvariant()
  $actual = (Get-FileHash (Join-Path $rescueTemp $file) -Algorithm SHA256).Hash.ToLowerInvariant()
  if ($actual -ne $expected) { throw "Checksum did not match. Nothing was installed." }
  Expand-Archive (Join-Path $rescueTemp $file) -DestinationPath $rescueTemp
  New-Item -ItemType Directory -Force -Path $installDir | Out-Null
  Copy-Item (Join-Path $rescueTemp "rescue.exe") (Join-Path $installDir "rescue.exe") -Force
  $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
  if (($userPath -split ";") -notcontains $installDir) {
    [Environment]::SetEnvironmentVariable("Path", ($userPath.TrimEnd(";") + ";" + $installDir), "User")
  }
  Write-Host "Installed rescue.exe at $installDir. Open a new terminal to run it."
} finally {
  Remove-Item -Recurse -Force $rescueTemp -ErrorAction SilentlyContinue
}
