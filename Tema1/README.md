## localhost

### tcp

Received: 6252 Size: 409600000 Time: 0.332s 8k 
Received: 6252 Size: 409599780 Time: 0.313s

### tcpWait

Received: 50001 Size: 409600004 Time: 65.642s 8k 
Received: 62521 Size: 409568524 Time: 83.749s

### udpWait

Received: 50000 Size: 409600000 Time: 92.244s

### udp

Received: 49999 Size: 409591808 Time: 5.159s

## remote machine (Oregon)

### tcp

works properly Received: 40818 Size: 409600000 Time: 26.368s

### udp local->Oregon

Received: 2743 Size: 22470656 Time: 1.006s Received: 6253 Size: 40956856 Time: 9.651s

- server lost packages (netstat) ~14 packages => udp doesn't reach the server

### udp wait local->Oregon

Received: 1300 Size: 10649600 Time: 176.5s to be continued

### tcp wait local->Oregon


### udp Oregon->Oregon (Linux)

Received: 13904 Size: 113901568 Time: 0.569s

13900 packets received (13900 + 36100 = 50000 all)
36100 packet receive errors 50000 packets sent (all)
36100 receive buffer errors

