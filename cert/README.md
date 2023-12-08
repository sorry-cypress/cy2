```sh
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 3650
openssl rsa -in key.pem -out key_nopass.pem
mv key_nopass.pem key.pem

# verify date

openssl x509 -enddate -noout -in cert.pem
```
