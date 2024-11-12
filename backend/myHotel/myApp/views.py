from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import re
from pymongo import MongoClient
from datetime import datetime
import uuid

client = MongoClient("mongodb://localhost:27017/")

db = client.HotelManagementSystem
admin_collection = db.admin
room_collection=db.room_management
booking_collection=db.booking_management
staff_collection=db.staff_management
@csrf_exempt
def sign_in(request):
    if request.method == "POST":

        data = json.loads(request.body)
        email = data["email"]
        password = data["password"]

        regex = r"^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$"

        if not re.match(regex, email):
            return JsonResponse(
                {"email": "Invalid Email!"}
            )

        user = admin_collection.find_one({"email": email})
        if user != None:
            if password != user["password"]:
                return JsonResponse({"notMatch": "invalid password"})
            pass
        else:
            return JsonResponse({"notMatch": "No user found with this email!"})
        return JsonResponse(
            {
                "message": f"Welcome {email}",
                "user_id": user["user_id"],
                "success": True,
            },
            status=200,
        )

@csrf_exempt
def sign_up(request):
    if request.method == "POST":

        data = json.loads(request.body)
        email = data["email"]
        password = data["password"]
        cpass = data["cpassword"]

        re_email = r"^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$"

        if not re.match(re_email, email):
            return JsonResponse(
                {"email": "Invalid Email"}
            )

        re_password = r'^(?=.*[\W_]).{6,}$'

        if not re.match(re_password, password):
            return JsonResponse(
                {
                    "password": "Invalid Password! please enter a password with  6 or more characters having at least 1 special symbol."
                }
            )

        if password != cpass:
            return JsonResponse({"cpassword": "Invalid Password! "})

        user_id = str(uuid.uuid4())

        data["user_id"] = user_id

        admin_collection.insert_one(data)

        return JsonResponse(
            {
                "message": f"Welcome {email}",
                "user_id": data["user_id"],
                "success": True,
            },
            status=200,
        )

@csrf_exempt
def get_admin_data(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user_id")
        user = admin_collection.find_one({"user_id": user_id})
        if user:
            user["_id"] = str(user["_id"])
            return JsonResponse({"user": user})
        return JsonResponse({"message": "User not found"}, status=404)

@csrf_exempt
def get_rooms(request):
    if request.method == "GET":
        rooms = list(room_collection.find())
        for room in rooms:
            del room["_id"] 
        return JsonResponse(rooms, safe=False)


@csrf_exempt
def add_room(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            room_number = data.get('room_number')
            room_type = data.get('room_type')
            price = data.get('price')
            image = data.get('image')  # Get the base64-encoded image

            # Check if the room number already exists
            if room_collection.find_one({"room_number": room_number}):
                return JsonResponse({'message': 'Room number already exists'}, status=400)

            room_id = str(uuid.uuid4())
            room_data = {
                "room_id": room_id,
                "room_number": room_number,
                "room_type": room_type,
                "price": price,
                "image": image  # Store the base64 image directly in the database
            }

            # Insert the room data into the MongoDB collection
            room_collection.insert_one(room_data)

            return JsonResponse({'message': 'Room added successfully', 'room_id': room_id}, status=201)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)

@csrf_exempt
def edit_room(request, room_id):
    if request.method == "PUT":
        data = json.loads(request.body)
        result = room_collection.update_one({"room_id": room_id}, {"$set": data})
        
        if result.matched_count == 0:
            return JsonResponse({"error": "Room not found"}, status=404)
        
        return JsonResponse({"message": "Room updated successfully"})

@csrf_exempt
def delete_room(request, room_id):
    if request.method == "DELETE":
        result = room_collection.delete_one({"room_id": room_id})
        
        if result.deleted_count == 0:
            return JsonResponse({"error": "Room not found"}, status=404)
        
        return JsonResponse({"message": "Room deleted successfully"}, status=204)

@csrf_exempt
def get_available_rooms(request):
    if request.method == "GET":
        # Get all room_ids that are currently booked
        booked_rooms = booking_collection.distinct("room")
        # Get all rooms that are not booked
        available_rooms = list(room_collection.find({"room_id": {"$nin": booked_rooms}}))
        for room in available_rooms:
            del room["_id"]  # Remove MongoDB's internal _id field
        return JsonResponse(available_rooms, safe=False)

@csrf_exempt
def get_bookings(request):
    if request.method == "GET":
        bookings = list(booking_collection.find())
        for booking in bookings:
            del booking["_id"] 
            room = room_collection.find_one({"room_id": booking["room"]})
            if room:
                booking["room"] = {
                    "room_id": room["room_id"],
                    "room_number": room["room_number"],
                    "room_type": room["room_type"],
                    "price": room["price"],
                    "image": room["image"]
                }
        return JsonResponse(bookings, safe=False)
    
@csrf_exempt
def generate_bill(request):
    if request.method == "GET":
        booking_id = request.GET.get("booking_id")

        if not booking_id:
            return JsonResponse({"message": "Booking ID is required"}, status=400)

        # Fetch the booking
        booking = booking_collection.find_one({"booking_id": booking_id})
        if not booking:
            return JsonResponse({"message": "Booking not found"}, status=404)
        
        # Fetch the room details
        room = room_collection.find_one({"room_id": booking["room"]})
        if not room:
            return JsonResponse({"message": "Room details not found"}, status=404)

        # Prepare the bill
        total_amount = booking["total_amount"]
        check_in_date = datetime.strptime(booking["check_in_date"], "%Y-%m-%d")
        check_out_date = datetime.strptime(booking["check_out_date"], "%Y-%m-%d")
        number_of_days = (check_out_date - check_in_date).days

        bill = {
            "customer_name": booking["customer_name"],
            "customer_email": booking["customer_email"],
            "room_number": room["room_number"],
            "room_type": room["room_type"],
            "amount_per_day": room["price"],
            "number_of_days": number_of_days,
            "total_amount": total_amount,
            "check_in_date": booking["check_in_date"],
            "check_out_date": booking["check_out_date"]
        }

        return JsonResponse(bill)
    
def calculate_total_amount(check_in_date, check_out_date, room_price):
    check_in = datetime.strptime(check_in_date, "%Y-%m-%d")
    check_out = datetime.strptime(check_out_date, "%Y-%m-%d")
    number_of_days = (check_out - check_in).days
    return str(int(number_of_days) * int(room_price))

@csrf_exempt
def add_booking(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        room = room_collection.find_one({"room_number": data["room"]["room_number"]})
        if not room:
            return JsonResponse({"error": "Room not found"}, status=404)
        check_in_date = data.get("check_in_date")
        check_out_date = data.get("check_out_date")
        if not check_in_date or not check_out_date:
            return JsonResponse({"error": "Check-in and Check-out dates are required"}, status=400)
        total_amount = calculate_total_amount(check_in_date, check_out_date, room["price"])
        booking_id = str(uuid.uuid4())
        data["booking_id"] = booking_id
        data["room"] = room["room_id"]
        data["total_amount"] = total_amount
        booking_collection.insert_one(data)
        return JsonResponse({"message": "Booking added successfully", "booking_id": booking_id}, status=201)
        

@csrf_exempt
def edit_booking(request, booking_id):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            existing_booking = booking_collection.find_one({"booking_id": booking_id})
            if not existing_booking:
                return JsonResponse({"error": "Booking not found"}, status=404)

            customer_name = data.get("customer_name", existing_booking["customer_name"])
            customer_email = data.get("customer_email", existing_booking["customer_email"])
            check_in_date = data.get("check_in_date", existing_booking["check_in_date"])
            check_out_date = data.get("check_out_date", existing_booking["check_out_date"])
            room_number = data.get("room", {}).get("room_number", existing_booking["room"])

            room = room_collection.find_one({"room_number": room_number})

            print(f"Room found: {room}")

            if not room:
                return JsonResponse({"error": "Room not found"}, status=404)
            total_amount = calculate_total_amount(check_in_date, check_out_date, room["price"])
            updated_booking = {
                "customer_name": customer_name,
                "customer_email": customer_email,
                "check_in_date": check_in_date,
                "check_out_date": check_out_date,
                "room": room["room_id"],
                "total_amount":total_amount
            }

            booking_collection.update_one({"booking_id": booking_id}, {"$set": updated_booking})

            return JsonResponse({"message": "Booking updated successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def delete_booking(request, booking_id):
    if request.method == "DELETE":
        result = booking_collection.delete_one({"booking_id": booking_id})

        if result.deleted_count == 0:
            return JsonResponse({"error": "Booking not found"}, status=404)

        return JsonResponse({"message": "Booking deleted successfully"}, status=200)
@csrf_exempt
def add_staff(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            staff_id = str(uuid.uuid4())
            staff_name = data.get('staff_name')
            staff_email = data.get('staff_email')
            staff_position = data.get('staff_position')
            staff_phone = data.get('staff_phone')
            hire_date = data.get('hire_date', datetime.now().strftime('%Y-%m-%d'))
            salary = data.get('salary')

            if staff_collection.find_one({"staff_email": staff_email}):
                return JsonResponse({'message': 'Staff email already exists'}, status=400)

            staff_data = {
                "staff_id": staff_id,
                "staff_name": staff_name,
                "staff_email": staff_email,
                "staff_position": staff_position,
                "staff_phone": staff_phone,
                "hire_date": hire_date,
                "salary": salary,
            }

            staff_collection.insert_one(staff_data)

            return JsonResponse({'message': 'Staff added successfully', 'staff_id': staff_id}, status=201)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)

@csrf_exempt
def edit_staff(request, staff_id):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            updated_data = {
                "staff_name": data.get('staff_name'),
                "staff_email": data.get('staff_email'),
                "staff_position": data.get('staff_position'),
                "staff_phone": data.get('staff_phone'),
                "hire_date": data.get('hire_date'),
                "salary": data.get('salary'),
            }

            staff_collection.update_one({"staff_id": staff_id}, {"$set": updated_data})

            return JsonResponse({'message': 'Staff updated successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)

@csrf_exempt
def delete_staff(request, staff_id):
    if request.method == "DELETE":
        try:
            staff_collection.delete_one({"staff_id": staff_id})
            return JsonResponse({'message': 'Staff deleted successfully'}, status=204)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)

def get_staff(request):
    if request.method == "GET":
        try:
            staff_list = list(staff_collection.find({}, {'_id': 0}))
            return JsonResponse(staff_list, safe=False)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)

# from django.core.mail import send_mail, BadHeaderError
# @csrf_exempt
# def send_contact_email(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         name = data['name']
#         email = data['email']
#         subject = data['subject']
#         message = data['message']

#         email_content = f"""
#         <html>
#         <body>
#             <h2>New Contact Us Message</h2>
#             <p><strong>Name:</strong> {name}</p>
#             <p><strong>Email:</strong> {email}</p>
#             <p><strong>Subject:</strong> {subject}</p>
#             <p><strong>Message:</strong><br>{message}</p>
#         </body>
#         </html>
#         """
        
#         try:
#             send_mail(
#                 subject=subject,
#                 message=message,
#                 from_email='ganpatajmera12@gmail.com',  # Use your email
#                 recipient_list=[email],
#                 fail_silently=False,
#                 html_message=email_content
#             )
#             return JsonResponse({'message': 'Email sent successfully'})
#         except BadHeaderError:
#             return JsonResponse({'message': 'Invalid header found'})
#         except Exception as e:
#             return JsonResponse({'error': str(e)})