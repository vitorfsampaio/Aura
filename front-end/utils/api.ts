export async function enviarLigacaoEmergencia({ numero, latitude, longitude, nome }: {
  numero: string;
  latitude: number;
  longitude: number;
  nome: string;
}) {
  try {
    const response = await fetch('http://192.168.1.8:5000/api/ligacao-emergencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero, latitude, longitude, nome }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.mensagem || 'Erro desconhecido');
    }
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
} 