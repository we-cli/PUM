' https://github.com/marklagendijk/node-pm2-windows-startup/blob/master/invisible.vbs
Set ws = CreateObject("WScript.Shell")
ws.Run WScript.Arguments(0), 0, True
