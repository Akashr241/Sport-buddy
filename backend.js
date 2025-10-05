
        // Initialize default users
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

        let user = null;
        let data = {
            sports: JSON.parse(localStorage.getItem('sports') || '[]'),
            cities: JSON.parse(localStorage.getItem('cities') || '[]'),
            areas: JSON.parse(localStorage.getItem('areas') || '[]'),
            events: JSON.parse(localStorage.getItem('events') || '[]')
        };

        function alert(msg, type = 'success') {
            document.getElementById('alert').innerHTML = `
                <div class="alert alert-${type} alert-dismissible fade show">
                    ${msg}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            setTimeout(() => { document.getElementById('alert').innerHTML = ''; }, 3000);
        }

        function goTo(page) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(page).classList.add('active');
        }

        function login() {
            const email = document.getElementById('loginEmail').value;
            const pass = document.getElementById('loginPass').value;

            if (!email || !pass) {
                alert('Fill all fields', 'danger');
                return;
            }

            const usr = localStorage.getItem(`user_${email}`);
            if (!usr) {
                alert('User not found', 'danger');
                return;
            }

            const u = JSON.parse(usr);
            if (u.password !== pass) {
                alert('Wrong password', 'danger');
                return;
            }

            user = u;
            alert(`Welcome ${u.name}!`);
            console.log('Login:', user);

            if (u.role === 'admin') {
                goTo('adminDash');
                loadAdmin();
            } else {
                document.getElementById('userName').textContent = u.name;
                goTo('userDash');
                loadUser();
            }
        }

        function register() {
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const pass = document.getElementById('regPass').value;
            const role = document.getElementById('regRole').value;

            if (!name || !email || !pass) {
                alert('Fill all fields', 'danger');
                return;
            }

            const u = { name, email, password: pass, role };
            localStorage.setItem(`user_${email}`, JSON.stringify(u));
            alert('Registered! Please login');
            goTo('login');
        }

        function logout() {
            user = null;
            goTo('login');
            alert('Logged out');
        }

        function showTab(tab) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.add('d-none'));
            document.getElementById(tab).classList.remove('d-none');
            document.querySelectorAll('#userDash .nav-link').forEach(l => l.classList.remove('active'));
            event.target.classList.add('active');
        }

        function showAdminTab(tab) {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.add('d-none'));
            document.getElementById(tab).classList.remove('d-none');
            document.querySelectorAll('#adminDash .nav-link').forEach(l => l.classList.remove('active'));
            event.target.classList.add('active');
        }

        function loadAdmin() {
            updateStats();
            renderSports();
            renderCities();
            renderAreas();
            renderAdminEvents();
            populateAreaCity();
        }

        function loadUser() {
            renderEvents();
            renderMyEvents();
            populateEventForm();
        }

        function updateStats() {
            document.getElementById('sSports').textContent = data.sports.length;
            document.getElementById('sCities').textContent = data.cities.length;
            document.getElementById('sAreas').textContent = data.areas.length;
            document.getElementById('sEvents').textContent = data.events.length;
        }

        function addSport() {
            const name = document.getElementById('sportName').value;
            if (!name) return alert('Enter name', 'danger');

            data.sports.push({ id: Date.now(), name });
            localStorage.setItem('sports', JSON.stringify(data.sports));
            document.getElementById('sportName').value = '';
            alert('Sport added!');
            renderSports();
            updateStats();
        }

        function delSport(id) {
            if (confirm('Delete?')) {
                data.sports = data.sports.filter(s => s.id !== id);
                localStorage.setItem('sports', JSON.stringify(data.sports));
                renderSports();
                updateStats();
            }
        }

        function renderSports() {
            const html = data.sports.length ? data.sports.map(s => `
                <div class="item-card">
                    <strong>${s.name}</strong>
                    <button class="btn btn-sm btn-danger float-end" onclick="delSport(${s.id})">Delete</button>
                </div>
            `).join('') : '<p>No sports yet</p>';
            document.getElementById('sportsList').innerHTML = html;
        }

        function addCity() {
            const name = document.getElementById('cityName').value;
            if (!name) return alert('Enter name', 'danger');

            data.cities.push({ id: Date.now(), name });
            localStorage.setItem('cities', JSON.stringify(data.cities));
            document.getElementById('cityName').value = '';
            alert('City added!');
            renderCities();
            updateStats();
            populateAreaCity();
        }

        function delCity(id) {
            if (confirm('Delete?')) {
                data.cities = data.cities.filter(c => c.id !== id);
                localStorage.setItem('cities', JSON.stringify(data.cities));
                renderCities();
                updateStats();
            }
        }

        function renderCities() {
            const html = data.cities.length ? data.cities.map(c => `
                <div class="item-card">
                    <strong>${c.name}</strong>
                    <button class="btn btn-sm btn-danger float-end" onclick="delCity(${c.id})">Delete</button>
                </div>
            `).join('') : '<p>No cities yet</p>';
            document.getElementById('citiesList').innerHTML = html;
        }

        function populateAreaCity() {
            const sel = document.getElementById('areaCity');
            sel.innerHTML = data.cities.length ? data.cities.map(c => 
                `<option value="${c.id}">${c.name}</option>`
            ).join('') : '<option>Add cities first</option>';
        }

        function addArea() {
            const cityId = parseInt(document.getElementById('areaCity').value);
            const name = document.getElementById('areaName').value;
            if (!name) return alert('Enter name', 'danger');

            data.areas.push({ id: Date.now(), cityId, name });
            localStorage.setItem('areas', JSON.stringify(data.areas));
            document.getElementById('areaName').value = '';
            alert('Area added!');
            renderAreas();
            updateStats();
        }

        function delArea(id) {
            if (confirm('Delete?')) {
                data.areas = data.areas.filter(a => a.id !== id);
                localStorage.setItem('areas', JSON.stringify(data.areas));
                renderAreas();
                updateStats();
            }
        }

        function renderAreas() {
            const html = data.areas.length ? data.areas.map(a => {
                const city = data.cities.find(c => c.id === a.cityId);
                return `
                    <div class="item-card">
                        <strong>${a.name}</strong> - ${city?.name || 'N/A'}
                        <button class="btn btn-sm btn-danger float-end" onclick="delArea(${a.id})">Delete</button>
                    </div>
                `;
            }).join('') : '<p>No areas yet</p>';
            document.getElementById('areasList').innerHTML = html;
        }

        function renderAdminEvents() {
            const html = data.events.length ? data.events.map(e => {
                const sport = data.sports.find(s => s.id === e.sportId);
                const city = data.cities.find(c => c.id === e.cityId);
                return `
                    <div class="item-card">
                        <h5>${e.name}</h5>
                        <p>Sport: ${sport?.name || 'N/A'} | City: ${city?.name || 'N/A'}</p>
                        <p>Date: ${e.date} ${e.time} | Location: ${e.location}</p>
                        <button class="btn btn-sm btn-danger" onclick="delEvent(${e.id})">Delete</button>
                    </div>
                `;
            }).join('') : '<p>No events</p>';
            document.getElementById('adminEventsList').innerHTML = html;
        }

        function delEvent(id) {
            if (confirm('Delete?')) {
                data.events = data.events.filter(e => e.id !== id);
                localStorage.setItem('events', JSON.stringify(data.events));
                renderAdminEvents();
                renderEvents();
                updateStats();
            }
        }

        function populateEventForm() {
            document.getElementById('eSport').innerHTML = data.sports.length ? 
                data.sports.map(s => `<option value="${s.id}">${s.name}</option>`).join('') : 
                '<option>Add sports first</option>';

            document.getElementById('eCity').innerHTML = data.cities.length ? 
                data.cities.map(c => `<option value="${c.id}">${c.name}</option>`).join('') : 
                '<option>Add cities first</option>';

            document.getElementById('eCity').addEventListener('change', function() {
                const cityId = parseInt(this.value);
                const areas = data.areas.filter(a => a.cityId === cityId);
                document.getElementById('eArea').innerHTML = areas.length ? 
                    areas.map(a => `<option value="${a.id}">${a.name}</option>`).join('') : 
                    '<option>No areas</option>';
            });

            if (data.cities.length > 0) {
                const firstCity = data.cities[0].id;
                const areas = data.areas.filter(a => a.cityId === firstCity);
                document.getElementById('eArea').innerHTML = areas.length ? 
                    areas.map(a => `<option value="${a.id}">${a.name}</option>`).join('') : 
                    '<option>No areas</option>';
            }
        }

        function createEvent() {
            const ev = {
                id: Date.now(),
                name: document.getElementById('eName').value,
                sportId: parseInt(document.getElementById('eSport').value),
                cityId: parseInt(document.getElementById('eCity').value),
                areaId: parseInt(document.getElementById('eArea').value),
                date: document.getElementById('eDate').value,
                time: document.getElementById('eTime').value,
                location: document.getElementById('eLoc').value,
                skill: document.getElementById('eSkill').value,
                creator: user.email
            };

            if (!ev.name || !ev.date || !ev.time || !ev.location) {
                return alert('Fill all fields', 'danger');
            }

            data.events.push(ev);
            localStorage.setItem('events', JSON.stringify(data.events));
            alert('Event created!');
            renderEvents();
            renderMyEvents();
        }

        function renderEvents() {
            const html = data.events.length ? data.events.map(e => {
                const sport = data.sports.find(s => s.id === e.sportId);
                const city = data.cities.find(c => c.id === e.cityId);
                const area = data.areas.find(a => a.id === e.areaId);
                return `
                    <div class="item-card">
                        <h5>${e.name}</h5>
                        <p><strong>Sport:</strong> ${sport?.name || 'N/A'}</p>
                        <p><strong>Location:</strong> ${e.location}, ${area?.name || ''}, ${city?.name || ''}</p>
                        <p><strong>Date/Time:</strong> ${e.date} at ${e.time}</p>
                        <p><strong>Skill:</strong> ${e.skill}</p>
                    </div>
                `;
            }).join('') : '<p>No events available</p>';
            document.getElementById('eventsList').innerHTML = html;
        }

        function renderMyEvents() {
            const myEvents = data.events.filter(e => e.creator === user.email);
            const html = myEvents.length ? myEvents.map(e => {
                const sport = data.sports.find(s => s.id === e.sportId);
                return `
                    <div class="item-card">
                        <h5>${e.name}</h5>
                        <p><strong>Sport:</strong> ${sport?.name || 'N/A'}</p>
                        <p><strong>Date:</strong> ${e.date} at ${e.time}</p>
                        <p><strong>Location:</strong> ${e.location}</p>
                        <button class="btn btn-sm btn-danger" onclick="delMyEvent(${e.id})">Delete</button>
                    </div>
                `;
            }).join('') : '<p>You have no events</p>';
            document.getElementById('myEventsList').innerHTML = html;
        }

        function delMyEvent(id) {
            if (confirm('Delete your event?')) {
                data.events = data.events.filter(e => e.id !== id);
                localStorage.setItem('events', JSON.stringify(data.events));
                renderEvents();
                renderMyEvents();
            }
        }
    