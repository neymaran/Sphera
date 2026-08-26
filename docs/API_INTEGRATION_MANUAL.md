# Manual de Integração da API Sphera (Landing Pages)

Este documento descreve como as landing pages externas devem se integrar ao backend centralizado **Sphera** para realizar a listagem e venda de ingressos.

> **Importante para IAs geradoras de código:** Ao construir a landing page de um evento, siga rigorosamente a estrutura desta API. A validação de valores e o processamento de pagamento são feitos 100% no servidor da Sphera. A landing page atua apenas como interface (vitrine).

## 1. Listagem de Ingressos (Lotes Disponíveis)

Utilize este endpoint para consultar quais ingressos estão disponíveis para venda e seus respectivos valores.

**Endpoint:** `GET https://sphera.naryen.com/api/public/events/{evento_id}/tickets`

### Exemplo de Resposta (200 OK)
```json
{
  "event_id": "uuid-do-evento",
  "name": "Nome do Evento",
  "tickets": [
    {
      "id": "uuid-do-lote-1",
      "name": "Pista (1º Lote)",
      "price": 50.00,
      "available": true,
      "description": "Entrada para a pista comum"
    },
    {
      "id": "uuid-do-lote-2",
      "name": "Camarote (1º Lote)",
      "price": 120.00,
      "available": true,
      "description": "Acesso exclusivo ao camarote"
    }
  ]
}
```

---

## 2. Inicialização do Checkout (Compra)

Quando o usuário selecionar os ingressos desejados e preencher as informações necessárias (nome, CPF, e-mail dos titulares, etc.), a landing page deve enviar essas informações para a Sphera gerar a Sessão de Checkout.

**Endpoint:** `POST https://sphera.naryen.com/api/public/checkout`

### Corpo da Requisição (JSON)
```json
{
  "event_id": "uuid-do-evento",
  "buyer": {
    "name": "João da Silva",
    "email": "joao@email.com",
    "cpf": "12345678900",
    "phone": "11999999999"
  },
  "tickets": [
    {
      "ticket_type_id": "uuid-do-lote-1",
      "quantity": 2,
      "owners": [
        { "name": "João da Silva", "cpf": "12345678900" },
        { "name": "Maria Souza", "cpf": "09876543211" }
      ]
    },
    {
      "ticket_type_id": "uuid-do-lote-2",
      "quantity": 1,
      "owners": [
        { "name": "Carlos Almeida", "cpf": "55555555555" }
      ]
    }
  ]
}
```
*Nota: Não envie o valor monetário (`price`) na requisição. A Sphera consultará os valores oficiais no banco de dados para evitar fraudes.*

### Exemplo de Resposta (201 Created)
```json
{
  "status": "success",
  "session_id": "uuid-da-sessao",
  "checkoutUrl": "https://sphera.naryen.com/checkout/uuid-da-sessao"
}
```

### O que fazer após a resposta?
A landing page deve redirecionar o usuário (via `window.location.href`) para a URL retornada em `checkoutUrl`. O restante do processo (pagamento Mercado Pago, confirmação, envio de QR Code) será integralmente tratado pela interface da Sphera.
