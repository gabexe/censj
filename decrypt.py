#!/usr/bin/env python3
"""
Script para descifrar cartas.json y crear cartas.decrypted.json
Uso: python decrypt.py
"""
import json
import base64

KEY = "CON_ESO_NO_SE_JODE_2025"

def xor_cipher(data: bytes, key: str) -> bytes:
    """Aplica XOR cipher a los datos"""
    key_bytes = key.encode('utf-8')
    result = bytearray()
    for i, byte in enumerate(data):
        result.append(byte ^ key_bytes[i % len(key_bytes)])
    return bytes(result)

def main():
    try:
        with open('cartas.json', 'r', encoding='utf-8') as f:
            encrypted_data = json.load(f)
        
        encrypted_bytes = base64.b64decode(encrypted_data['data'])
        decrypted_bytes = xor_cipher(encrypted_bytes, KEY)
        cartas = json.loads(decrypted_bytes.decode('utf-8'))
        
        with open('cartas.decrypted.json', 'w', encoding='utf-8') as f:
            json.dump(cartas, f, indent=2, ensure_ascii=False)
        
        print(f"OK - {len(cartas)} cartas descifradas")
        print("Archivo creado: cartas.decrypted.json")
        print("\nAhora puedes:")
        print("  1. Editar cartas.decrypted.json")
        print("  2. Ejecutar: python encrypt_cartas.py")
        
    except FileNotFoundError:
        print("ERROR: No se encontró cartas.json")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    main()
