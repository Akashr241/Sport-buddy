    if (!localStorage.getItem('user_admin@sportsbuddy.com')) {
            localStorage.setItem('user_admin@sportsbuddy.com', JSON.stringify({
                name: 'Admin', email: 'admin@sportsbuddy.com', password: 'admin123', role: 'admin'
            }));
        }
        if (!localStorage.getItem('user_user@sportsbuddy.com')) {
            localStorage.setItem('user_user@sportsbuddy.com', JSON.stringify({
                name: 'User', email: 'user@sportsbuddy.com', password: 'user123', role: 'user'
            }));
        }