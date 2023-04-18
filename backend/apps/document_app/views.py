from django.http import JsonResponse
from py2neo import Graph, Node, Relationship
from datetime import datetime
import os
from dotenv import load_dotenv
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
graph = Graph(os.environ.get('BOLT_URL'), auth=(os.environ.get('BOLT_USER'), os.environ.get('BOLT_PASSWORD')))

@api_view(['POST'])
@csrf_exempt
def create_document(request):
    data = json.loads(request.body)
    document_name = data.get("name")
    created_by = data.get("user_id")
    box_id = data.get("box_id")

    query = f"MATCH (b:Box) WHERE ID(b) = {box_id} RETURN b"
    box_data = graph.run(query).data()
    if not box_data:
        return JsonResponse({"error": "Box not found"})
    
    box_node = box_data[0]['b']

    document = Node("Document", name=document_name, created_by=created_by, created_at=datetime.now(), updated_at=datetime.now())
    graph.create(document)

    child_rel = Relationship(box_node, "child", document)
    graph.create(child_rel)

    return JsonResponse({"status": "success"})

@api_view(['GET'])
def get_documents(request, box_id):
    query = f"MATCH (b:Box)-[r:child]->(d:Document) WHERE ID(b) = {box_id} RETURN d"
    result = graph.run(query)
    documents = []

    for record in result:
        document = record['d']
        documents.append({"id": document.identity, "name": document['name'], "created_by": document['created_by']})

    return JsonResponse({"documents": documents})
