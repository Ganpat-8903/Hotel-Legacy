from django.urls import path
from .views import (
    sign_in, sign_up, get_admin_data, add_room, get_rooms,
    edit_room, delete_room, get_bookings, add_booking, 
    edit_booking, delete_booking,get_available_rooms,generate_bill,
    add_staff, edit_staff, delete_staff, get_staff
    # ,send_contact_email
)

urlpatterns = [
    path('sign_in/', sign_in),
    path('sign_up/', sign_up),
    path('get_customer_data/', get_admin_data),

    # Room Management Paths
    path('add_room/', add_room),
    path('get_rooms/', get_rooms),
    path('edit_room/<str:room_id>/', edit_room),
    path('delete_room/<str:room_id>/', delete_room),

    # Booking Management Paths
    path('get_bookings/', get_bookings),
    path('add_booking/', add_booking),
    path('edit_booking/<str:booking_id>/', edit_booking),
    path('delete_booking/<str:booking_id>/', delete_booking),
    
    path('get_available_rooms/',get_available_rooms),
    path('generate_bill/', generate_bill),
    
    # Staff Management Paths
    path('add_staff/', add_staff),
    path('get_staff/', get_staff),
    path('edit_staff/<str:staff_id>/', edit_staff),
    path('delete_staff/<str:staff_id>/', delete_staff),
    
    # path('contact_us/', send_contact_email),
]
