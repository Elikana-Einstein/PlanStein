

export const EmailService = {
    async fetchEmails() {
        try {
            const response = await fetch('https://api.example.com/emails');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.emails; // Assuming the API returns { emails: [...] }
        } catch (error) {
            console.error('Error fetching emails:', error);
            throw error;
        }
    },
};