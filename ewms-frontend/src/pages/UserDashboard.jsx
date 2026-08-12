import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  mockNotifications,
  mockPickups,
  mockRecyclers,
} from '../data/mockData';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  assigned: 'bg-blue-100 text-blue-700 border border-blue-200',
  in_progress: 'bg-violet-100 text-violet-700 border border-violet-200',
  completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border border-red-200',
};

const statusSteps = {
  pending: ['Request Submitted'],
  assigned: ['Request Submitted', 'Assigned'],
  in_progress: ['Request Submitted', 'Assigned', 'Pickup In Progress'],
  completed: ['Request Submitted', 'Assigned', 'Pickup In Progress', 'Completed'],
  cancelled: ['Cancelled'],
};

const quickActions = [
  { key: 'request', label: 'Request Pickup' },
  { key: 'pickups', label: 'My Pickups' },
  { key: 'centers', label: 'Collection Centers' },
  { key: 'rewards', label: 'Rewards' },
];

const emptyForm = {
  category: 'Laptops',
  itemName: '',
  quantity: '1',
  address: '',
  pickupDate: '',
  pickupTime: '',
  notes: '',
};

function StatCard({ label, value, accent }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-forest-400 mb-2">{label}</p>
      <h3 className={`font-heading text-3xl ${accent}`}>{value}</h3>
    </div>
  );
}

function UserDashboard() {
  const { user, logout } = useAuth();
  const [pickups, setPickups] = useState(() =>
    mockPickups.filter((pickup) => pickup.userId === user.id)
  );
  const [notifications, setNotifications] = useState(() =>
    mockNotifications.filter(
      (notification) => notification.userId === user.id || notification.userId === 'all'
    )
  );
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPickup, setSelectedPickup] = useState(() =>
    mockPickups.find((pickup) => pickup.userId === user.id) || null
  );
  const [formData, setFormData] = useState(emptyForm);
  const [successMessage, setSuccessMessage] = useState('');

  const rewardHistory = useMemo(
    () =>
      pickups
        .filter((pickup) => pickup.status === 'completed')
        .map((pickup) => ({
          label: `+${pickup.rewardPoints || 0} ${pickup.itemName}`,
          points: pickup.rewardPoints || 0,
          date: pickup.pickupDate,
        })),
    [pickups]
  );

  const currentRewards = rewardHistory.reduce(
    (total, reward) => total + Number(reward.points || 0),
    0
  );

  const stats = useMemo(() => {
    const total = pickups.length;
    const pending = pickups.filter(
      (pickup) => ['pending', 'assigned', 'in_progress'].includes(pickup.status)
    ).length;
    const completed = pickups.filter((pickup) => pickup.status === 'completed').length;

    return { total, pending, completed, rewards: currentRewards };
  }, [pickups, currentRewards]);

  const recentActivity = useMemo(() => {
    const pickupActivity = pickups.map((pickup) => ({
      id: pickup.id,
      title: pickup.status === 'completed'
        ? 'Pickup completed'
        : pickup.status === 'cancelled'
          ? 'Pickup cancelled'
          : pickup.status === 'assigned'
            ? 'Pickup assigned'
            : pickup.status === 'in_progress'
              ? 'Pickup in progress'
              : 'Pickup requested',
      date: pickup.lastUpdated || pickup.pickupDate,
      type: pickup.status,
    }));

    const rewardActivity = rewardHistory.map((reward) => ({
      id: `reward-${reward.date}`,
      title: 'Reward earned',
      date: reward.date,
      type: 'reward',
    }));

    return [...pickupActivity, ...rewardActivity].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [pickups, rewardHistory]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const requiredFields = ['category', 'itemName', 'quantity', 'address', 'pickupDate', 'pickupTime'];
    const hasEmptyValue = requiredFields.some((field) => !String(formData[field]).trim());

    if (hasEmptyValue) {
      setSuccessMessage('Please complete all required pickup fields before submitting.');
      return;
    }

    const newPickup = {
      id: `PU-${Date.now().toString().slice(-5)}`,
      userId: user.id,
      category: formData.category,
      itemName: formData.itemName,
      quantity: formData.quantity,
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      address: formData.address,
      notes: formData.notes || 'No additional notes provided.',
      status: 'pending',
      assignedRecycler: 'Awaiting assignment',
      rewardPoints: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    setPickups((current) => [newPickup, ...current]);
    setSelectedPickup(newPickup);
    setFormData(emptyForm);
    setSuccessMessage('Pickup request created successfully. Your request is now pending review.');
    setActiveTab('pickups');
  };

  const handleMarkNotificationRead = (notificationId) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const renderStatusTrack = (status) => {
    const steps = statusSteps[status] || ['Request Submitted'];
    const currentIndex = status === 'cancelled' ? 0 : status === 'pending' ? 0 : status === 'assigned' ? 1 : status === 'in_progress' ? 2 : 3;

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {steps.map((step, index) => {
            const active = index <= currentIndex;
            return (
              <span
                key={step}
                className={`badge ${active ? 'bg-moss-100 text-moss-700' : 'bg-forest-50 text-forest-300'}`}
              >
                {step}
              </span>
            );
          })}
        </div>
        {status === 'cancelled' && (
          <p className="text-sm text-red-600 font-medium">This pickup was cancelled and will not continue through processing.</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-mint-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="card-glass px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-forest rounded-2xl flex items-center justify-center shadow-glow">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8c.7 0 1.4.1 2 .3C18.1 5.3 15.3 3 12 3 7.6 3 4 6.6 4 11c0 1.8.6 3.5 1.7 4.8" />
                  <path d="M11 21c-1.7 0-3.2-.7-4.3-1.7" />
                  <path d="M15.5 17.5 12 21l-3.5-3.5" />
                  <path d="m12 3 0 18" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-forest-400">EcoDispose</p>
                <h1 className="font-heading text-2xl text-forest-500">Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Signed in</p>
                <p className="font-semibold text-forest-500">{user.name}</p>
              </div>
              <span className="badge bg-moss-100 text-moss-700 capitalize">{user.role}</span>
              <button type="button" onClick={logout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="card p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Welcome back</p>
              <h2 className="font-heading text-3xl sm:text-4xl text-forest-500 mt-2">{user.name}</h2>
              <p className="text-forest-400 mt-2 max-w-xl">
                Ready to make a difference with responsible e-waste disposal?
              </p>
            </div>
            <span className="badge bg-forest-100 text-forest-600 capitalize">{user.role}</span>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Pickups" value={stats.total} accent="text-forest-500" />
          <StatCard label="Pending" value={stats.pending} accent="text-amber-600" />
          <StatCard label="Completed" value={stats.completed} accent="text-emerald-600" />
          <StatCard label="Reward Points" value={`${stats.rewards} pts`} accent="text-moss-600" />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <button
              key={action.key}
              type="button"
              onClick={() => setActiveTab(action.key)}
              className={`card p-4 text-left transition-all ${
                activeTab === action.key ? 'border-2 border-moss-300 shadow-card-hover' : ''
              }`}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Action</p>
              <h3 className="font-heading text-xl text-forest-500 mt-2">{action.label}</h3>
            </button>
          ))}
        </section>

        {activeTab === 'request' && (
          <section className="card p-6">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Request pickup</p>
                <h3 className="font-heading text-2xl text-forest-500">New e-waste request</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="input-label">E-waste category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option>Computers</option>
                  <option>Laptops</option>
                  <option>Mobile Phones</option>
                  <option>Televisions</option>
                  <option>Refrigerators</option>
                  <option>Batteries</option>
                  <option>Printers</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="input-label">Item / device name</label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Dell laptop, old phone, etc."
                />
              </div>

              <div>
                <label className="input-label">Quantity</label>
                <input
                  type="number"
                  min="1"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="input-label">Preferred pickup date</label>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label">Preferred time</label>
                <input
                  type="time"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="md:col-span-2">
                <label className="input-label">Pickup address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="House/office address"
                />
              </div>

              <div className="md:col-span-2">
                <label className="input-label">Additional notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="input-field"
                  placeholder="Gate code, access instructions, item condition, etc."
                />
              </div>

              {successMessage && (
                <div className="md:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              )}

              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="btn-primary">
                  Submit Pickup Request
                </button>
              </div>
            </form>
          </section>
        )}

        {(activeTab === 'overview' || activeTab === 'pickups') && (
          <section className="grid gap-5 xl:grid-cols-[1.5fr_0.9fr]">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-forest-400">My pickups</p>
                  <h3 className="font-heading text-2xl text-forest-500">Pickup history</h3>
                </div>
              </div>

              <div className="space-y-4">
                {pickups.map((pickup) => (
                  <button
                    key={pickup.id}
                    type="button"
                    onClick={() => setSelectedPickup(pickup)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all ${
                      selectedPickup?.id === pickup.id
                        ? 'border-moss-300 bg-moss-50'
                        : 'border-forest-100 bg-white hover:border-forest-200'
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-forest-400">{pickup.id}</p>
                        <h4 className="font-heading text-xl text-forest-500 mt-1">{pickup.itemName}</h4>
                      </div>
                      <span className={`badge capitalize ${statusStyles[pickup.status] || statusStyles.pending}`}>
                        {pickup.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-forest-500 sm:grid-cols-3">
                      <span>{pickup.category}</span>
                      <span>Qty: {pickup.quantity}</span>
                      <span>{pickup.pickupDate}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-6">
              {selectedPickup ? (
                <>
                  <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Pickup details</p>
                  <h3 className="font-heading text-2xl text-forest-500 mt-2">{selectedPickup.id}</h3>
                  <div className="mt-5 space-y-3 text-sm text-forest-600">
                    <p><span className="font-semibold">Item:</span> {selectedPickup.itemName}</p>
                    <p><span className="font-semibold">Category:</span> {selectedPickup.category}</p>
                    <p><span className="font-semibold">Quantity:</span> {selectedPickup.quantity}</p>
                    <p><span className="font-semibold">Address:</span> {selectedPickup.address}</p>
                    <p><span className="font-semibold">Date:</span> {selectedPickup.pickupDate}</p>
                    <p><span className="font-semibold">Time:</span> {selectedPickup.pickupTime}</p>
                    <p><span className="font-semibold">Status:</span> <span className="capitalize">{selectedPickup.status.replace('_', ' ')}</span></p>
                    <p><span className="font-semibold">Assigned Recycler:</span> {selectedPickup.assignedRecycler || 'Not assigned yet'}</p>
                    <p><span className="font-semibold">Notes:</span> {selectedPickup.notes}</p>
                    {selectedPickup.status === 'completed' && (
                      <p><span className="font-semibold">Reward earned:</span> {selectedPickup.rewardPoints || 0} pts</p>
                    )}
                    {selectedPickup.status === 'cancelled' && (
                      <p className="text-red-600 font-medium">Pickup cancelled.</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-forest-400 mb-3">Status tracking</p>
                    {renderStatusTrack(selectedPickup.status)}
                  </div>
                </>
              ) : (
                <p className="text-forest-400">Select a pickup to view its details.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'centers' && (
          <section className="card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Collection centers</p>
            <h3 className="font-heading text-2xl text-forest-500 mt-2">Nearby recycling hubs</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {mockRecyclers.map((center) => (
                <div key={center.id} className="border border-forest-100 rounded-2xl p-5 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-heading text-xl text-forest-500">{center.name}</h4>
                      <p className="text-sm text-forest-400">{center.location}</p>
                    </div>
                    <span className={`badge ${center.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {center.status === 'verified' ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-forest-600">
                    <li><span className="font-semibold">Region:</span> {center.region}</li>
                    <li><span className="font-semibold">Accepted:</span> {center.acceptedWaste?.join(', ') || 'Computers, Phones, Batteries'}</li>
                    <li><span className="font-semibold">Contact:</span> {center.contact || '+256 700 123 456'}</li>
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'rewards' && (
          <section className="grid gap-5 xl:grid-cols-[1.1fr_1.4fr]">
            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Rewards</p>
              <h3 className="font-heading text-3xl text-forest-500 mt-2">{currentRewards} pts</h3>
              <p className="text-forest-500 mt-4">Points earned from completed pickups and recycling activities.</p>
              <button type="button" className="btn-secondary mt-5">Redeem Rewards (Demo)</button>
            </div>

            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Reward history</p>
              <div className="mt-5 space-y-3">
                {rewardHistory.length > 0 ? (
                  rewardHistory.map((reward, index) => (
                    <div key={`${reward.label}-${index}`} className="flex items-center justify-between rounded-xl bg-moss-50 px-4 py-3 text-sm text-forest-600">
                      <span>{reward.label}</span>
                      <span>{reward.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-forest-400">No completed pickups yet. Finish a collection to earn rewards.</p>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Notifications</p>
            <h3 className="font-heading text-2xl text-forest-500 mt-2">Latest updates</h3>
            <div className="mt-5 space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="rounded-2xl border border-forest-100 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-forest-500">{notification.title}</p>
                      <p className="text-sm text-forest-500 mt-1">{notification.message}</p>
                    </div>
                    {notification.unread && (
                      <span className="badge bg-recycling-orange-100 text-recycling-orange-700">New</span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-forest-400">
                    <span>{notification.date}</span>
                    <button
                      type="button"
                      onClick={() => handleMarkNotificationRead(notification.id)}
                      className="btn-ghost"
                    >
                      {notification.unread ? 'Mark read' : 'Read'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Recent activity</p>
            <h3 className="font-heading text-2xl text-forest-500 mt-2">Latest events</h3>
            <div className="mt-5 space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between gap-3 rounded-xl bg-mint-50 px-3 py-2 text-sm text-forest-600">
                  <span>{activity.title}</span>
                  <span className="text-forest-400">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;
