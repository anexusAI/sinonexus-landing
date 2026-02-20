
// Future chatbot API logic will be inserted here.
console.log("Chatbot module placeholder.");
// SinoNexus API Integration
const API_URL = 'https://sinonexus-api.onrender.com'; // Your Render URL

async function checkEligibility(formData) {
    try {
        const response = await fetch(`${API_URL}/api/assess`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                passType: formData.passType || 'EP',
                nationality: formData.nationality,
                age: parseInt(formData.age),
                monthlySalary: parseInt(formData.salary) || 0,
                sector: formData.sector || 'others',
                isFinance: formData.isFinance === 'true' || false,
                education: formData.education || 'degree',
                universityTier: formData.universityTier || 'degree',
                district: formData.district || 'default',
                yearsInSingapore: parseInt(formData.yearsInSG) || 0,
                familyTies: formData.familyTies || 'none',
                compassScore: formData.compassScore ? parseInt(formData.compassScore) : undefined,
                jobTitle: 'other'
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const result = await response.json();
        displayResult(result);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to get assessment. Please try again.');
    }
}

function displayResult(result) {
    // Create or update result display
    let resultDiv = document.getElementById('assessment-result');
    
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'assessment-result';
        document.body.appendChild(resultDiv);
    }
    
    resultDiv.innerHTML = `
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background: #f3f4f6; border-radius: 12px; font-family: Arial, sans-serif;">
            <h2 style="text-align: center; color: #111827; margin-bottom: 10px;">
                Approval Probability: ${result.probability}%
            </h2>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <span style="display: inline-block; padding: 8px 16px; background: ${result.probability >= 70 ? '#dcfce7' : result.probability >= 50 ? '#fef3c7' : '#fee2e2'}; color: ${result.probability >= 70 ? '#166534' : result.probability >= 50 ? '#92400e' : '#dc2626'}; border-radius: 20px; font-weight: bold; text-transform: uppercase;">
                    ${result.tier}
                </span>
            </div>
            
            <p style="color: #374151; margin-bottom: 20px; text-align: center;">
                ${result.recommendation}
            </p>
            
            <h3 style="color: #111827; margin-bottom: 10px;">Score Breakdown:</h3>
            <div style="margin-bottom: 20px;">
                ${result.factors.map(f => `
                    <div style="display: flex; justify-content: space-between; padding: 10px; background: white; margin-bottom: 8px; border-radius: 6px;">
                        <span>${f.factor}</span>
                        <span style="font-weight: bold;">${f.points}/${f.max}</span>
                    </div>
                `).join('')}
            </div>
            
            ${result.warnings.length > 0 ? `
                <div style="padding: 15px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="color: #92400e; margin-bottom: 10px;">⚠️ Important Notes:</h4>
                    ${result.warnings.map(w => `<p style="color: #92400e; margin: 5px 0;">${w}</p>`).join('')}
                </div>
            ` : ''}
            
            <p style="font-size: 12px; color: #6b7280; text-align: center;">
                ${result.disclaimer}
            </p>
        </div>
    `;
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Hook into your existing form
// If you have a form with id="eligibility-form", use this:
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('eligibility-form') || document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                passType: form.querySelector('[name="passType"]')?.value || 'EP',
                nationality: form.querySelector('[name="nationality"]')?.value,
                age: form.querySelector('[name="age"]')?.value,
                salary: form.querySelector('[name="salary"]')?.value,
                sector: form.querySelector('[name="sector"]')?.value,
                isFinance: form.querySelector('[name="isFinance"]')?.value,
                education: form.querySelector('[name="education"]')?.value,
                universityTier: form.querySelector('[name="universityTier"]')?.value,
                district: form.querySelector('[name="district"]')?.value,
                yearsInSG: form.querySelector('[name="yearsInSG"]')?.value,
                familyTies: form.querySelector('[name="familyTies"]')?.value,
                compassScore: form.querySelector('[name="compassScore"]')?.value
            };
            
            checkEligibility(formData);
        });
    }
});