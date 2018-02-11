# raspi livestream box
Turn your Raspberry Pi into headless a  audio source for [Icecast](http://icecast.org) internet radio.

To see how it works, [start here](https://github.com/johnelliott/raspi-livestream-box/blob/master/roles/app/tasks/main.yml).

## logging via journalctl
- `journalctl -x -b --unit picast.service`
- `systemctl status picast.service`

## hardware setup
- get a raspberry pi with a soundcard
- install Raspbian Stretch lite or Stretch and expand the filesystem, set locales etc.
- set up the raspi with ssh key access i.e. `$ ssh mypi` lets you run commands via ssh
- connect some Raspberry Pis with ssh access via their ssh host name on your network
- find the soundcard vendor and product id form lsusb

## deploy setup
- connect prepared Raspberry Pis to the network
- install [Ansible](https://ansible.com) 2.4+ via [homebrew](https://brew.sh)
- create create ansible config file
- create create ansible inventory file
- create wpa_supplicant.conf
- run `ansible-playbook deploy.yml`

### ansible.cfg example
located in project directory
```conf
[defaults]
inventory=inventory.ini
```
### inventory.ini example
located in project directory
this has the channel and psk variables set for specified hosts
```conf
[streamers]
mypinhostname

[streamers:vars]
stream_url=http://example.com:8000/mystream
stream_password=hackme
soundcard_vendor_id="1ab2"
soundcard_product_id="0001"
```
### wpa_supplicant.conf example
located in `this_project_directory/roles/wifi/files/wpa_supplicant.conf`
```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
network={
	ssid="My iPhone Hotspot"
	key_mgmt=WPA-PSK
	psk=wpa_passphrase_result0000000000000000000000000000000000000000000
	priority=100
}
network={
	ssid="my-home-network"
	psk=wpa_passphrase_result0000000000000000000000000000000000000000000
	key_mgmt=WPA-PSK
	priority=99
}
```
