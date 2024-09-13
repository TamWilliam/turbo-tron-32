# TurboTron32

## Introduction

Ce projet est réalisé dans le cadre d’un projet de fin d'année au sein de l’école HETIC. Il s’agit de la réalisation d’une course de voiture électrique où le but est de faire le meilleur temps par rapport aux autres groupes d’étudiants. Notre projet, Turbo Tron 32, est une application innovante de course de voitures. Notre équipe est composée de Valérie Song, Maxime Ait Adda, Rémi Petit, William Tam, David Pikusa, Jeanne Bissinga et Pierre Leroy.

Le projet HETIC Web 3 Tech Race consiste en deux challenges : un où notre équipe contrôle le véhicule via une application que nous avons développée, et un autre où la voiture doit se repérer seule sur un parcours prédéfini. Notre application permettra aux utilisateurs de contrôler la voiture, de visualiser les statistiques en temps réel, de suivre les données de course et de visualiser la course depuis la caméra embarquée.

Notre projet se divise en deux parties : le niveau 1, où nous développons une application mobile pour contrôler le véhicule et afficher les statistiques en temps réel, et le niveau 2, où nous permettons à la voiture de fonctionner en totale autonomie et de remporter la course.

## Gestion des erreurs

### Compilation de platformio

Lorsque vous compilez votre code pour le mettre sur l'ESP32, vous pouvez rencontrer plusieurs erreurs.

#### Port COM

```shell
Error: Please specify upload_port for environment or use global --upload-port option.
```

Dans ce cas, vous devrez [télécharger le driver correspondant](https://www.silabs.com/documents/public/software/CP210x_Windows_Drivers.zip)

Dans votre gestionnaire de périphérique devrait s'afficher le port USB COM. Si ce n'est pas le cas, essayer avec un autre câble USB pourrait résoudre ce problème.

#### Wifi

##### Error 1

```shell
[.pio\build\esp-wrover-kit\src\main.cpp.o] Error 1
```

Dans ce cas, il s'agit probablement d'une erreur dans le paramétrage des crédentials de votre wifi. Vérifiez bien les informations que vous avez rentrées (ssid, password, IP, ...). N'oubliez pas également les lignes spécifiant la connexion WebSocket. Assurez-vous d'être sur le même wifi que l'ESP32.

```cpp
char *ssid_wifi = "Nom de mon réseau wifi"; // Le nom du réseau WiFi
char *password_wifi = "Mot de passe";    // Le password du WiFi

const char *mqtt_server = "192.168.1.1"; // L'IP de votre broker MQTT (votre IP)
const int mqtt_interval_ms = 1000;           // L'interval en ms entre deux envois de données

IPAddress localIP(192, 168, 1, 1); // l'IP que vous voulez donner à votre voiture

IPAddress localGateway(192, 168, 1, 12); // L'IP de la gateway de votre réseau
IPAddress localSubnet(255, 255, 255, 0);   // Le masque de sous réseau

IPAddress primaryDNS(8, 8, 8, 8);
IPAddress secondaryDNS(8, 8, 4, 4);

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");
```

##### Error 2

```shell
Error 2: could not open /dev/ttyusb0 the port doesn't exist
```

Une variable upload_port contient ```/dev/ttyusb0```, supprimez cette ligne et tentez à nouveau d'upload votre code dans l'ESP32.

### Connexion WebSocket

#### Timeout

Si vous rencontrez un timeout, il peut s'agir d'une erreur dans le paramétrage des crédentials de votre wifi. Vérifiez bien les informations que vous avez rentrées (ssid, password, IP, ...). N'oubliez pas également les lignes spécifiant la connexion WebSocket. Assurez-vous d'être sur le même wifi que l'ESP32.

Il peut s'agir d'un problème lié aux piles. Changez les ou chargez les puis réessayer.
