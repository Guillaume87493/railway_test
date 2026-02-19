from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn
import os

app = FastAPI()

@app.websocket('/ws')
async def eindpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_json({'message1': 'hallo dit is een test'})
    try:
        while True:
            data = await websocket.receive_text()
            listData = list(data)
            for i in range(len(listData)):
                listData[i] = '*'

            antwoord = ''.join(listData)
            await websocket.send_json({'message2': antwoord})
    except WebSocketDisconnect:
        print('fout')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
        