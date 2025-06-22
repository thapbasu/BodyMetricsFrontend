// src/components/RoleSelector.jsx
export default function RoleSelector({ selectedRole, onChange }) {
    const roles = [
        { id: 'owner', label: 'Me (Owner)', description: 'You and your partner’s special account' },
        { id: 'partner', label: 'Partner', description: 'Your loved one’s account' },
        { id: 'guest', label: 'Guest', description: 'For visitors or friends' },
    ];

    return (
        <div className="flex justify-between space-x-4">
            {roles.map(({ id, label, description }) => (
                <label
                    key={id}
                    htmlFor={id}
                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition
          ${selectedRole === id ? 'bg-lilac text-white border-lilac' : 'bg-white border-gray-300 hover:border-lilac'}
          `}
                >
                    <input
                        type="radio"
                        id={id}
                        name="role"
                        value={id}
                        checked={selectedRole === id}
                        onChange={() => onChange(id)}
                        className="hidden"
                    />
                    <span className="font-semibold">{label}</span>
                    <small className="text-xs mt-1">{description}</small>
                </label>
            ))}
        </div>
    );
}
