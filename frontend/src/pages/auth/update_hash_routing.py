import re

file_path = '/home/tufa15/Documents/Menter_Bro/Full-Stack Project/SmartShop-AI/Smartshop-ClientSide/frontend/src/pages/auth/ProfilePage.jsx'

with open(file_path, 'r') as f:
    content = f.read()

# Add useEffect for location.hash
effect_code = """
    useEffect(() => {
        if (orders.length > 0 && location.hash) {
            const hashId = location.hash.replace('#', '').toUpperCase();
            const matchingOrder = orders.find(o => {
                const razorpayId = o.paymentDetails?.razorpayOrderId;
                const objectIdFull = o._id.toUpperCase();
                return (razorpayId && razorpayId.toUpperCase().includes(hashId)) || objectIdFull.includes(hashId);
            });
            if (matchingOrder) {
                setSelectedOrderId(matchingOrder._id);
            }
        }
    }, [orders, location.hash]);
"""

# Insert effect after the existing useEffects
content = re.sub(r'(    }, \[activeTab, fetchOrders, fetchReviews, fetchProfile\]\);)', r'\1\n' + effect_code, content)

# Change onClick in List view
# onClick={() => setSelectedOrderId(order._id)}
# to
# onClick={() => navigate(`/orders/#${order.paymentDetails?.razorpayOrderId?.split('_')[1] || order._id.toUpperCase().slice(-8)}`)}
content = content.replace("onClick={() => setSelectedOrderId(order._id)}", "onClick={() => navigate(`/orders/#${order.paymentDetails?.razorpayOrderId?.split('_')[1] || order._id.toUpperCase().slice(-8)}`)}")


# Also when closing an order details view, remove the hash
content = content.replace("onBack={() => setSelectedOrderId(null)}", "onBack={() => { setSelectedOrderId(null); navigate('/orders'); }}")

with open(file_path, 'w') as f:
    f.write(content)
