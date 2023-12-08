```sh
openssl genrsa -out rootCA.key 4096

# enter somewhat real details
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1825 -out rootCA.pem


# enter somewhat real details with api.cy.io as FQDN
openssl genrsa -out domain.key 2048
openssl req -new -key domain.key -out domain.csr
openssl x509 -req -in domain.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out domain.crt -days 1825 -sha256

```
