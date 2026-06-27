import re

file_path = '/home/tufa15/Documents/Menter_Bro/Full-Stack Project/SmartShop-AI/Smartshop-ClientSide/frontend/src/pages/auth/ProfilePage.jsx'

with open(file_path, 'r') as f:
    content = f.read()

# Replace state initialization
old_state = """    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab');
    const orderIdParam = queryParams.get('orderId');

    const [activeTab, setActiveTab] = useState(tabParam || location.state?.activeTab || 'profile'); // 'profile', 'address', 'wallet', 'orders', 'returns', 'cancellations', 'reviews'"""

new_state = """    const queryParams = new URLSearchParams(location.search);
    const orderIdParam = queryParams.get('orderId');

    const pathTabMap = {
        '/profile': 'profile',
        '/address': 'address',
        '/wallet': 'wallet',
        '/orders': 'orders',
        '/return': 'returns',
        '/cancel': 'cancellations',
        '/reviews': 'reviews'
    };
    
    const activeTab = pathTabMap[location.pathname] || 'profile';"""

content = content.replace(old_state, new_state)

# Replace setActiveTab with navigate
content = content.replace("setActiveTab('profile')", "navigate('/profile')")
content = content.replace("setActiveTab('address')", "navigate('/address')")
content = content.replace("setActiveTab('wallet')", "navigate('/wallet')")
content = content.replace("setActiveTab('orders')", "navigate('/orders')")
content = content.replace("setActiveTab('returns')", "navigate('/return')")
content = content.replace("setActiveTab('cancellations')", "navigate('/cancel')")
content = content.replace("setActiveTab('reviews')", "navigate('/reviews')")

with open(file_path, 'w') as f:
    f.write(content)
