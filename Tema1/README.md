## localhost

### tcp

works properly Received: 6252 Size: 409600000 Time: 0.332s

### udpWait with 10ms delay

Received: 50000 Size: 409600000 Time: 5.783s

### udp

Received: 45871 Size: 375775232 Time: 5.174s

## remote machine (Oregon)

### tcp

works properly Received: 40818 Size: 409600000 Time: 26.368s

### udpWait with 10ms delay

Received: 12045 Size: 98672640 Time: 5.645s

### udp wait with 100ms delay

Received: 50000 Size: 409600000 Time: 51.586s udp

### udp local->Oregon

Received: 2743 Size: 22470656 Time: 1.006s

- server lost packages (netstat) ~14 packages => udp doesn't reach the server

### udp Oregon->Oregon (Linux)

Received: 13904 Size: 113901568 Time: 0.569s

13900 packets received (13900 + 36100 = 50000 all)
36100 packet receive errors
50000 packets sent (all)
36100 receive buffer errors

