# Suiveur de ligne

Projet Turbotron.

Je ne pense pas que ça ai une grande importance mais je suis sur Python 3.12.4.

Il se connecte au Mosquitto de mon serveur privé pour simplifier les choses.

# Mise en marche :

python -m venv env

env/Scripts/activate

pip install --no-cache-dir -r requirements.txt

python .\mqtt_client.py

# Faire un fichier de requirements :

pip freeze > requirements.txt
