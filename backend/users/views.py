from django.shortcuts import render
from rest_framework import viewsets, permissions 
from .serializers import * 
from .models import * 
from rest_framework.response import Response 
from django.contrib.auth import get_user_model, authenticate
from knox.models import AuthToken
from rest_framework.decorators import api_view
from django.db.models import Q

User = get_user_model()

class LoginViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def create(self, request): 
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(): 
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            if user: 
                _, token = AuthToken.objects.create(user)
                return Response(
                    {
                        "user": self.serializer_class(user).data,
                        "token": token
                    }
                )
            else: 
                return Response({"error":"Invalid credentials"}, status=401)    
        else: 
            return Response(serializer.errors,status=400)



class RegisterViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self,request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else: 
            return Response(serializer.errors,status=400)


class UserViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def list(self,request):
        queryset = User.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    


@api_view(['GET'])
def get_latest_member_id(request):
    latest_member = Member.objects.order_by('-member_id').first()
    next_id = latest_member.member_id + 1 if latest_member else 1
    return Response({'next_id': next_id})

@api_view(['POST'])
def create_member(request):
    serializer = MemberSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def search_member_by_id(request, member_id):
    try:
        member = Member.objects.get(member_id=member_id)
        member_data = MemberSerializer(member).data
        transactions = Transaction.objects.filter(member=member).order_by('-date')
        transaction_data = TransactionSerializer(transactions, many=True).data
        return Response({
            "member": member_data,
            "transactions": transaction_data
        })
    except Member.DoesNotExist:
        return Response({"error": "Member not found"}, status=404)
    

@api_view(['POST'])
def create_transaction(request):
    print(request.data)
    
    try:
        member = Member.objects.get(member_id=request.data['member'])
    except Member.DoesNotExist:
        return Response({'member': ['Invalid member_id - object does not exist.']}, status=400)

    data = request.data.copy()
    data['member'] = member.id  # convert to primary key

    serializer = TransactionSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)



@api_view(['GET'])
def search_members_by_name_or_email(request):
    query = request.GET.get('query', '')
    members = Member.objects.filter(
        Q(name__icontains=query) | Q(email__icontains=query)
    )
    serializer = MemberSerializer(members, many=True)
    return Response(serializer.data)
