from http import HTTPStatus
import re

def resposta_api(codigo:HTTPStatus, mensagem:str) -> dict[str, str | int]:
    return {
        "codigo": codigo,
        "mensagem": mensagem,
    }

def coordenadas_validas(lat, lon):
    try:
        lat = float(lat)
        lon = float(lon)
        return -90 <= lat <= 90 and -180 <= lon <= 180
    except (TypeError, ValueError):
        return False


def telefone_valido(numero):
    if not numero or isinstance(numero, int):
        return False
    padrao = re.compile(r'^\+\d{11,15}$')
    return padrao.match(numero) is not None

def criar_link_maps(latitude, longitude):
    return f"https://www.google.com/maps?q={latitude},{longitude}"

def verificar_campos(numero, latitude, longitude, nome):
    campos_obrigatorios = {"numero": numero, "latitude": latitude, "longitude": longitude, "nome": nome}
    for campo, valor in campos_obrigatorios.items():
        if not valor:
            return campo
