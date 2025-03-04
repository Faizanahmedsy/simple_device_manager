import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Laptop,
  Smartphone,
  Monitor,
  Headphones,
  Search,
} from "lucide-react";

// Define types
interface Device {
  id: string;
  name: string;
  type: "laptop" | "smartphone" | "monitor" | "headphones" | "other";
  serialNumber: string;
  assignedTo: string;
}

function App() {
  // State for devices and form inputs
  const [devices, setDevices] = useState<Device[]>(() => {
    const savedDevices = localStorage.getItem("devices");
    return savedDevices ? JSON.parse(savedDevices) : [];
  });
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState<Device["type"]>("laptop");
  const [serialNumber, setSerialNumber] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAssignedTo, setEditAssignedTo] = useState("");

  // Save devices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("devices", JSON.stringify(devices));
  }, [devices]);

  // Add a new device
  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();

    if (!deviceName) return;

    const newDevice: Device = {
      id: Date.now().toString(),
      name: deviceName,
      type: deviceType,
      serialNumber,
      assignedTo,
    };

    setDevices([...devices, newDevice]);

    // Reset form
    setDeviceName("");
    setDeviceType("laptop");
    setSerialNumber("");
    setAssignedTo("");
    setIsAdding(false);
  };

  // Delete a device
  const handleDeleteDevice = (id: string) => {
    setDevices(devices.filter((device) => device.id !== id));
  };

  // Update device assignment
  const handleUpdateAssignment = (id: string) => {
    setDevices(
      devices.map((device) =>
        device.id === id ? { ...device, assignedTo: editAssignedTo } : device
      )
    );
    setEditingId(null);
    setEditAssignedTo("");
  };

  // Filter devices based on search term
  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get icon based on device type
  const getDeviceIcon = (type: Device["type"]) => {
    switch (type) {
      case "laptop":
        return <Laptop className="h-5 w-5" />;
      case "smartphone":
        return <Smartphone className="h-5 w-5" />;
      case "monitor":
        return <Monitor className="h-5 w-5" />;
      case "headphones":
        return <Headphones className="h-5 w-5" />;
      default:
        return <Laptop className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Device Management System for Devstree
          </h1>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-white text-indigo-600 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-50 transition-colors"
          >
            {isAdding ? (
              "Cancel"
            ) : (
              <>
                <PlusCircle className="h-5 w-5" />
                <span>Add Device</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Add Device Form */}
        {isAdding && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Device</h2>
            <form
              onSubmit={handleAddDevice}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Name
                </label>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="MacBook Pro 2023"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Type
                </label>
                <select
                  value={deviceType}
                  onChange={(e) =>
                    setDeviceType(e.target.value as Device["type"])
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="laptop">Laptop</option>
                  <option value="smartphone">Smartphone</option>
                  <option value="monitor">Monitor</option>
                  <option value="headphones">Headphones</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="SN12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To (Optional)
                </label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add Device
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search devices by name, serial number or employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Devices List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">
              Devices ({filteredDevices.length})
            </h2>
          </div>

          {filteredDevices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {devices.length === 0
                ? "No devices added yet. Click 'Add Device' to get started."
                : "No devices match your search criteria."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDevices.map((device) => (
                    <tr key={device.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                            {getDeviceIcon(device.type)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {device.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {device.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {device.serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === device.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editAssignedTo}
                              onChange={(e) =>
                                setEditAssignedTo(e.target.value)
                              }
                              className="p-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Employee name"
                            />
                            <button
                              onClick={() => handleUpdateAssignment(device.id)}
                              className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditAssignedTo("");
                              }}
                              className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingId(device.id);
                              setEditAssignedTo(device.assignedTo);
                            }}
                            className="text-sm cursor-pointer hover:text-indigo-600 hover:underline"
                          >
                            {device.assignedTo || (
                              <span className="text-gray-400 italic">
                                Click to assign
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteDevice(device.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1 ml-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 border-t border-gray-200 mt-8">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} an open source project by{" "}
          <a
            href="https://faizansaiyed.vercel.app/"
            className="text-indigo-600"
          >
            Faizan
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
