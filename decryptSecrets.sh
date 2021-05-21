#!/bin/sh

mkdir -p ~/.ssh
gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" --output secrets.tar secrets.tar.gpg
tar xvf secrets.tar
mv ssh_config ~/.ssh/config
mv id_rsa ~/.ssh/
echo '|1|QsBUSGZ3XgCpBIEOQ4nWddnrAB4=|BH9U4cD7MtlYEq+QS5XxMWusTWs= ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBINVTfpN2biVLflB1uePszlavG4be7hKHb+ZtJmTOx58EavVR4s3f9UYvKJVc+mifGB/S7e5g9vck05a6M6HHls=' >> ~/.ssh/known_hosts
chmod 0600 ~/.ssh/*
