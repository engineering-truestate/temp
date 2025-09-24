const handleProjectSelect = async (project, event) => {
    try {
      const searchValue2 = toCapitalizedWords(project.projectName);
      setSearchTerm(searchValue2);
      setIsDropdownVisible(false);
      setisSelected(true);
      setiserror(false);
      // selectedproperty = project;
      const assetType = project.assetType; // Default to "apartment" if assetType is not defined
      project.assetType = assetType; // Ensure assetType is set on the project object
      setSelectedProperty(project);
    } catch (error) { }
  };