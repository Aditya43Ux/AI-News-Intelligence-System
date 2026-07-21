from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_predict_endpoint_returns_prediction_shape():
    response = client.post('/predict', json={'text': 'Stocks rally after strong company earnings and upbeat market outlook.'})
    assert response.status_code == 200
    payload = response.json()
    assert set(payload.keys()) == {'category', 'sentiment', 'confidence', 'keywords', 'summary'}
    assert isinstance(payload['confidence'], (int, float))
    assert isinstance(payload['keywords'], list)
    assert isinstance(payload['summary'], str)


def test_forecast_endpoint_returns_seven_values():
    response = client.get('/forecast')
    assert response.status_code == 200
    values = response.json()
    assert isinstance(values, list)
    assert len(values) == 7
    assert all(isinstance(v, (int, float)) for v in values)


def test_version_endpoint_returns_metadata():
    response = client.get('/version')
    assert response.status_code == 200
    payload = response.json()
    assert payload['service'] == 'ai-news-intelligence-api'
    assert payload['version']


def test_readiness_endpoint_reports_state():
    response = client.get('/readyz')
    assert response.status_code == 200
    payload = response.json()
    assert payload['status'] in {'ready', 'loading'}


def test_predict_endpoint_rejects_empty_text():
    response = client.post('/predict', json={'text': ''})
    assert response.status_code == 422
