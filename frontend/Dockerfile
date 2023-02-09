FROM httpd

COPY . /usr/local/apache2/htdocs/

# Enable SSL in apache2 configuration
RUN sed -i \
		-e 's/^#\(Include .*httpd-ssl.conf\)/\1/' \
		-e 's/^#\(LoadModule .*mod_ssl.so\)/\1/' \
		-e 's/^#\(LoadModule .*mod_socache_shmcb.so\)/\1/' \
		/usr/local/apache2/conf/httpd.conf

# Generate self-signed SSL certificate
RUN openssl genrsa -out /usr/local/apache2/conf/server.key
RUN openssl req -new -batch -key /usr/local/apache2/conf/server.key -out /usr/local/apache2/conf/csr.pem
RUN openssl x509 -req -days 9999 -in /usr/local/apache2/conf/csr.pem -signkey /usr/local/apache2/conf/server.key -out /usr/local/apache2/conf/server.crt