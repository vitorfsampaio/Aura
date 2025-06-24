from twilio.rest import Client
from settings import *
from util import criar_link_maps

client = Client(ACCOUNT_SID, AUTH_TOKEN)

def enviar_sms(numero, lat, log, nome):
    maps = criar_link_maps(lat, log)
    message = client.messages.create(
        body=f"Este é um aviso automático. A última localização de {nome} foi registrada em:\n{maps}",
        from_=TWILIO_NUMBER,
        to=numero
    )
    return message

def fazer_ligacao(numero, lat, log, nome):
    try:
        call = client.calls.create(
            twiml=f"<Response><Say language='pt-BR'>Atenção. Este é um alerta de segurança automático. {nome} pode estar em perigo. A última localização foi enviada por mensagem. Verifique imediatamente. Repetindo: esta é uma chamada de emergência.</Say></Response>",
            to=numero,
            from_=TWILIO_NUMBER
        )

        message = enviar_sms(numero, lat, log, nome)

        return {"status": True, "call": call, "message": message}

    except Exception as e:
        return {"status": False, "data":e}