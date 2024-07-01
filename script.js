const members = [
    { name: "Member 1", class: "Class 1", votes: 0, comments: [], likes: 0, dislikes: 0 },
    { name: "Member 2", class: "Class 2", votes: 0, comments: [], likes: 0, dislikes: 0 },
    { name: "Member 3", class: "Class 3", votes: 0, comments: [], likes: 0, dislikes: 0 },
    // Add more members as needed
];

let users = [
    { username: "admin", password: "admin123", role: "admin", votes: [], profile: { name: "Admin", class: "N/A" }, activities: [] },
    { username: "member1", password: "Member1", role: "member", votes: [], profile: { name: "Member 1", class: "Class 1" }, activities: [] },
    { username: "ayush", password: "1", role: "member", votes: [], profile: { name: "Ayush", class: "Class 10th" }, activities: [] },
    // Add more users as needed
];

let loggedInUser = null;

window.onload = function() {
    showSection('home');
    populateMembers();
    populateLeaderboard();
    setInterval(checkHeadOfECOClub, 1000 * 60 * 60 * 24 * 30); // Monthly check
};

function showSection(section) {
    document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(`${section}-section`).classList.remove('hidden');
    if (section === 'voting-chart') populateVotingChart();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        loggedInUser = user;
        document.getElementById('login-section').classList.add('hidden');
        if (user.role === 'admin') {
            document.getElementById('admin-section').classList.remove('hidden');
            populateAdminMembers();
            populateAnalytics();
        } else {
            document.getElementById('user-section').classList.remove('hidden');
            populateUserVotes();
            populateUserProfile();
            populateVotingHistory();
            populateActivityLog();
        }
    } else {
        document.getElementById('login-message').textContent = "Invalid username or password";
    }
}

function populateMembers() {
    const memberList = document.getElementById('member-list');
    const memberSelect = document.getElementById('member-select');
    memberList.innerHTML = '';
    memberSelect.innerHTML = '';

    members.forEach((member, index) => {
        // Add to member list
        const listItem = document.createElement('li');
        listItem.textContent = `${member.name} (Class: ${member.class}) - Votes: ${member.votes}`;
        memberList.appendChild(listItem);

        // Add to member select dropdown
        const option = document.createElement('option');
        option.value = index;
        option.textContent = member.name;
        memberSelect.appendChild(option);
    });
}

function vote() {
    const memberSelect = document.getElementById('member-select');
    const selectedIndex = memberSelect.value;

    if (selectedIndex !== "" && !loggedInUser.votes.includes(selectedIndex)) {
        members[selectedIndex].votes += 1;
        loggedInUser.votes.push(selectedIndex);
        loggedInUser.activities.push(`Voted for ${members[selectedIndex].name}`);
        members[selectedIndex].activities.push(`Received vote from ${loggedInUser.profile.name}`);
        populateMembers();
        populateLeaderboard();
        populateVotingHistory();
        populateActivityLog();
        document.getElementById('vote-message').textContent = "Vote successful!";
        sendEmailNotification(members[selectedIndex].name, "vote");
    } else {
        document.getElementById('vote-message').textContent = "You have already voted for this member.";
    }
}

function sendEmailNotification(memberName, type) {
    // Placeholder function for sending email notifications
    console.log(`Sending email notification: ${type} received for ${memberName}`);
}

function populateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';

    // Sort members by votes in descending order
    const sortedMembers = [...members].sort((a, b) => b.votes - a.votes);

    sortedMembers.forEach(member => {
        const listItem = document.createElement('li');
        listItem.textContent = `${member.name} (Class: ${member.class}) - Votes: ${member.votes}`;
        leaderboardList.appendChild(listItem);
    });
}

function populateAdminMembers() {
    const adminMemberList = document.getElementById('admin-member-list');
    adminMemberList.innerHTML = '';

    members.forEach((member, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${member.name} (Class: ${member.class}) - Votes: ${member.votes}
            <button onclick="removeMember(${index})">Remove</button>
            <button onclick="editMember(${index})">Edit</button>
        `;
        adminMemberList.appendChild(listItem);
    });
}

function addMember() {
    const newMemberName = document.getElementById('new-member-name').value;
    const newMemberClass = document.getElementById('new-member-class').value;
    if (newMemberName && newMemberClass) {
        members.push({ name: newMemberName, class: newMemberClass, votes: 0, comments: [], likes: 0, dislikes: 0 });
        users.push({ username: newMemberName.toLowerCase(), password: newMemberName.split(' ')[0], role: 'member', votes: [], profile: { name: newMemberName, class: newMemberClass }, activities: [] });
        populateMembers();
        populateAdminMembers();
        populateAnalytics();
    }
}

function removeMember(index) {
    const member = members[index];
    members.splice(index, 1);
    users = users.filter(user => user.profile.name !== member.name);
    populateMembers();
    populateAdminMembers();
    populateAnalytics();
}

function editMember(index) {
    // Implement edit member functionality
}

function populateAnalytics() {
    // Implement analytics population functionality
}

function populateUserVotes() {
    const userVoteList = document.getElementById('user-vote-list');
    userVoteList.innerHTML = '';
    loggedInUser.votes.forEach(voteIndex => {
        const listItem = document.createElement('li');
        listItem.textContent = members[voteIndex].name;
        userVoteList.appendChild(listItem);
    });
}

function populateUserProfile() {
    document.getElementById('profile-name').value = loggedInUser.profile.name;
    document.getElementById('profile-class').value = loggedInUser.profile.class;
}

function populateVotingHistory() {
    const votingHistoryList = document.getElementById('voting-history-list');
    votingHistoryList.innerHTML = '';
    loggedInUser.activities.forEach(activity => {
        const listItem = document.createElement('li');
        listItem.textContent = activity;
        votingHistoryList.appendChild(listItem);
    });
}

function populateActivityLog() {
    const activityLog = document.getElementById('activity-log');
    activityLog.innerHTML = '';
    members.forEach(member => {
        member.activities.forEach(activity => {
            const listItem = document.createElement('li');
            listItem.textContent = `${activity} - ${member.name}`;
            activityLog.appendChild(listItem);
        });
    });
}

function changePassword() {
    const newPassword = document.getElementById('new-password').value;
    if (newPassword) {
        loggedInUser.password = newPassword;
        alert('Password changed successfully');
    }
}

function updateProfile() {
    const newName = document.getElementById('profile-name').value;
    const newClass = document.getElementById('profile-class').value;
    if (newName && newClass) {
        loggedInUser.profile.name = newName;
        loggedInUser.profile.class = newClass;
        alert('Profile updated successfully');
    }
}

function checkHeadOfECOClub() {
    const headMember = members.reduce((prev, current) => (prev.votes > current.votes) ? prev : current, members[0]);
    document.getElementById('head-member-name').textContent = headMember.name;
}

function exportVotingData() {
    const csvData = members.map(member => `${member.name},${member.class},${member.votes}`).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voting_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function populateVotingChart() {
    const ctx = document.getElementById('votingChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: members.map(member => member.name),
            datasets: [{
                label: 'Votes',
                data: members.map(member => member.votes),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function addComment() {
    const selectedIndex = document.getElementById('member-select').value;
    const newComment = document.getElementById('new-comment').value;
    if (selectedIndex !== "" && newComment) {
        members[selectedIndex].comments.push(newComment);
        document.getElementById('new-comment').value = '';
        populateComments(selectedIndex);
    }
}

function populateComments(index) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    members[index].comments.forEach(comment => {
        const listItem = document.createElement('li');
        listItem.textContent = comment;
        commentsList.appendChild(listItem);
    });
}

function searchMembers() {
    const query = document.getElementById('search-query').value.toLowerCase();
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    const filteredMembers = members.filter(member => member.name.toLowerCase().includes(query) || member.class.toLowerCase().includes(query));
    filteredMembers.forEach(member => {
        const listItem = document.createElement('li');
        listItem.textContent = `${member.name} (Class: ${member.class})`;
        searchResults.appendChild(listItem);
    });
}

function downloadCertificate() {
    const memberName = document.getElementById('certificate-member-name').textContent;
    const certificateText = `
        Certificate of Achievement

        This is to certify that ${memberName} has received more than 50 votes
        and is awarded this certificate for their outstanding contribution.

        ECO Club - Kendriya Vidyalaya Tatanagar
    `;
    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificate.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
