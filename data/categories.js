export const defaultCategories = [
    // SELL Categories
    
    {
      id: "SELL",
      name: "Sell",
      type: "SELL",
      color: "#0ADD08",
      icon: "Home",
    },
    
    {
      id: "BUY",
      name: "Buy",
      type: "BUY",
      color: "#FF0000",
      icon: "Home",
    },
    
  ];
  
  export const categoryColors = defaultCategories.reduce((acc, category) => {
    acc[category.id] = category.color;
    return acc;
  }, {});