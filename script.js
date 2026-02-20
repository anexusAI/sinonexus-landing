
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
    // MVP: Hide score breakdown from applicants
    // Backend still sends full data, but we only display summary
    
    let resultDiv = document.getElementById('assessment-result');
    
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'assessment-result';
        document.body.appendChild(resultDiv);
    }
    
    // Color based on probability
    let tierColor, tierBg;
    if (result.probability >= 70) {
        tierBg = '#dcfce7';
        tierColor = '#166534';
    } else if (result.probability >= 50) {
        tierBg = '#fef3c7';
        tierColor = '#92400e';
    } else {
        tierBg = '#fee2e2';
        tierColor = '#dc2626';
    }
    
    resultDiv.innerHTML = `
        <div style="max-width: 600px; margin: 30px auto; padding: 40px 30px; background: #ffffff; border-radius: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <h2 style="color: #374151; margin-bottom: 8px; font-size: 16px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                Your Approval Probability
            </h2>
            
            <!-- Big Percentage -->
            <div style="font-size: 80px; font-weight: 800; color: #c41e3a; margin: 20px 0; line-height: 1;">
                ${result.probability}<span style="font-size: 40px; font-weight: 600;">%</span>
            </div>
            
            <!-- Tier Badge -->
            <div style="margin-bottom: 30px;">
                <span style="display: inline-block; padding: 12px 28px; background: ${tierBg}; color: ${tierColor}; border-radius: 25px; font-weight: 700; text-transform: uppercase; font-size: 14px; letter-spacing: 0.5px;">
                    ${result.tier} Probability
                </span>
            </div>
            
            <!-- Recommendation -->
            <p style="color: #1f2937; margin-bottom: 30px; font-size: 18px; line-height: 1.6; font-weight: 500;">
                ${result.recommendation}
            </p>
            
            <!-- Warnings (if any) -->
            ${result.warnings && result.warnings.length > 0 ? `
                <div style="padding: 20px; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px; margin-bottom: 30px; text-align: left;">
                    <h4 style="color: #92400e; margin-bottom: 12px; font-size: 14px; font-weight: 600;">⚠️ Important Notes</h4>
                    ${result.warnings.map(w => `<p style="color: #92400e; margin: 8px 0; font-size: 14px; line-height: 1.5;">• ${w}</p>`).join('')}
                </div>
            ` : ''}
            
            <!-- Disclaimer -->
            <p style="font-size: 12px; color: #9ca3af; margin: 25px 0; line-height: 1.5;">
                ${result.disclaimer}
            </p>
            
            <!-- CTA for Premium Consultation -->
            <div style="margin-top: 35px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin-bottom: 16px; font-size: 15px;">
                    Want personalized guidance to improve your chances?
                </p>
                <a href="premium.html" style="display: inline-block; padding: 16px 36px; background: #111827; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; transition: all 0.2s;">
                    Book Expert Consultation
                </a>
                <p style="color: #9ca3af; margin-top: 12px; font-size: 13px;">
                    Get detailed analysis and personalized strategy
                </p>
            </div>
        </div>
    `;
    
    // Smooth scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
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