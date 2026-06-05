export const dashboardData = {
  city: "Magdeburg",
  title: "SmartCity Operations Dashboard",
  metrics: [
    {
      label: "Air Quality",
      value: 34,
      unit: "AQI",
      delta: "-8",
      trend: "Good",
      tone: "green"
    },
    {
      label: "Transit Load",
      value: 68,
      unit: "%",
      delta: "+5",
      trend: "Busy",
      tone: "blue"
    },
    {
      label: "Energy Demand",
      value: 42,
      unit: "MW",
      delta: "-3",
      trend: "Stable",
      tone: "amber"
    },
    {
      label: "Open Incidents",
      value: 7,
      unit: "",
      delta: "-2",
      trend: "Managed",
      tone: "red"
    }
  ],
  districts: [
    {
      name: "Altstadt",
      status: "Stable",
      score: 86,
      traffic: 58,
      energy: 72
    },
    {
      name: "Stadtfeld",
      status: "Watch",
      score: 74,
      traffic: 81,
      energy: 66
    },
    {
      name: "Buckau",
      status: "Stable",
      score: 82,
      traffic: 47,
      energy: 69
    },
    {
      name: "Cracau",
      status: "Action",
      score: 61,
      traffic: 88,
      energy: 76
    }
  ],
  mobility: [
    { label: "Tram punctuality", value: 91 },
    { label: "Bike lane usage", value: 63 },
    { label: "Road congestion", value: 44 },
    { label: "Parking occupancy", value: 79 }
  ],
  energy: [
    { label: "Solar contribution", value: 37 },
    { label: "Grid load", value: 62 },
    { label: "Building efficiency", value: 71 },
    { label: "EV charging use", value: 54 }
  ],
  alerts: [
    {
      title: "Traffic density rising near Universitaetsplatz",
      severity: "Medium",
      time: "12 min ago"
    },
    {
      title: "EV charging cluster operating near capacity",
      severity: "Low",
      time: "28 min ago"
    },
    {
      title: "Water level sensor maintenance scheduled",
      severity: "Info",
      time: "1 hr ago"
    }
  ],
  activity: [
    {
      actor: "Mobility API",
      action: "Published updated tram load data",
      time: "3 min ago"
    },
    {
      actor: "Energy Grid",
      action: "Recorded lower evening demand forecast",
      time: "18 min ago"
    },
    {
      actor: "Incident Desk",
      action: "Closed two traffic reports",
      time: "43 min ago"
    },
    {
      actor: "Sensor Network",
      action: "Validated air quality readings",
      time: "1 hr ago"
    }
  ]
};
