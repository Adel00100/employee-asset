(function () {
  const employees = [
    { id: 'adel-ahmed', number: 'EMP-001', name: 'Adel Ahmed', title: 'Software Engineer', department: 'Engineering', office: 'London' },
    { id: 'sara-mohamed', number: 'EMP-002', name: 'Sara Mohamed', title: 'Marketing Manager', department: 'Marketing', office: 'New York' },
    { id: 'omar-ali', number: 'EMP-003', name: 'Omar Ali', title: 'Operations Lead', department: 'Operations', office: 'Chicago' },
    { id: 'layla-ibrahim', number: 'EMP-004', name: 'Layla Ibrahim', title: 'Financial Analyst', department: 'Finance', office: 'London' },
    { id: 'khalid-nasser', number: 'EMP-005', name: 'Khalid Nasser', title: 'IT Support Specialist', department: 'IT', office: 'Dubai' },
    { id: 'maya-chen', number: 'EMP-006', name: 'Maya Chen', title: 'Product Designer', department: 'Design', office: 'Chicago' }
  ];

  const demoAssets = [
    { tag: 'AST-1024', manufacturer: 'Dell', model: 'Latitude 5420', type: 'Laptop', purchaseDate: '2025-04-12', warrantyExpiry: '2028-04-12', employeeId: 'adel-ahmed', assignedDate: '2025-04-14' },
    { tag: 'AST-1025', manufacturer: 'Apple', model: 'iPhone 15', type: 'Phone', purchaseDate: '2025-06-05', warrantyExpiry: '2026-12-05', employeeId: 'sara-mohamed', assignedDate: '2025-06-07' },
    { tag: 'AST-1026', manufacturer: 'HP', model: 'E27 G5 Monitor', type: 'Monitor', purchaseDate: '2025-08-19', warrantyExpiry: '2028-08-19', employeeId: 'omar-ali', assignedDate: '2025-08-20' },
    { tag: 'AST-1027', manufacturer: 'Apple', model: 'MacBook Pro 14', type: 'Laptop', purchaseDate: '2025-01-10', warrantyExpiry: '2028-01-10', employeeId: 'layla-ibrahim', assignedDate: '2025-01-12' },
    { tag: 'AST-1028', manufacturer: 'Logitech', model: 'MX Keys', type: 'Keyboard', purchaseDate: '2025-09-02', warrantyExpiry: '2026-10-24', employeeId: 'khalid-nasser', assignedDate: '2025-09-03' },
    { tag: 'AST-1029', manufacturer: 'Dell', model: 'XPS 13', type: 'Laptop', purchaseDate: '2024-11-16', warrantyExpiry: '2027-11-16', employeeId: 'maya-chen', assignedDate: '2024-11-18' },
    { tag: 'AST-1030', manufacturer: 'Samsung', model: 'Galaxy S24', type: 'Phone', purchaseDate: '2025-02-22', warrantyExpiry: '2027-02-22', employeeId: 'sara-mohamed', assignedDate: '2025-02-24' },
    { tag: 'AST-1031', manufacturer: 'HP', model: 'EliteBook 840 G10', type: 'Laptop', purchaseDate: '2024-10-03', warrantyExpiry: '2027-10-03', employeeId: 'adel-ahmed', assignedDate: '2024-10-05' },
    { tag: 'AST-1032', manufacturer: 'Apple', model: 'iPad Air', type: 'Tablet', purchaseDate: '2025-03-14', warrantyExpiry: '2027-03-14', employeeId: 'layla-ibrahim', assignedDate: '2025-03-16' },
    { tag: 'AST-1033', manufacturer: 'Dell', model: 'WD22 Docking Station', type: 'Accessory', purchaseDate: '2026-01-20', warrantyExpiry: '2029-01-20', employeeId: '', assignedDate: '' },
    { tag: 'AST-1034', manufacturer: 'Lenovo', model: 'ThinkPad E14', type: 'Laptop', purchaseDate: '2026-02-01', warrantyExpiry: '2029-02-01', employeeId: '', assignedDate: '' },
    { tag: 'AST-1035', manufacturer: 'Samsung', model: 'ViewFinity S6 27', type: 'Monitor', purchaseDate: '2025-10-10', warrantyExpiry: '2028-10-10', employeeId: '', assignedDate: '' }
  ];

  const assignmentsKey = 'corpgear.demo.assignments';
  const newAssetsKey = 'corpgear.demo.new-assets';
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function getEmployees() {
    return employees;
  }

  function getEmployee(id) {
    return employees.find((employee) => employee.id === id);
  }

  function getAssets() {
    return [...demoAssets, ...readStorage(newAssetsKey, [])];
  }

  function getAssignment(asset) {
    const saved = readStorage(assignmentsKey, {})[asset.tag];
    return saved ? { employeeId: saved.employeeId || '', assignedDate: saved.assignedDate || '' } : { employeeId: asset.employeeId || '', assignedDate: asset.assignedDate || '' };
  }

  function saveAssignment(tag, employeeId, assignedDate) {
    const assignments = readStorage(assignmentsKey, {});
    assignments[tag] = { employeeId, assignedDate: employeeId ? assignedDate : '' };
    return writeStorage(assignmentsKey, assignments);
  }

  function formatDate(value) {
    if (!value) return '—';
    return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
  }

  function getWarranty(expiry) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.ceil((new Date(`${expiry}T00:00:00`) - today) / 86400000);
    if (days < 0) return { label: 'Expired', className: 'warranty-expired' };
    if (days <= 30) return { label: `Due in ${days} days`, className: 'warranty-due' };
    return { label: 'In coverage', className: 'warranty-covered' };
  }

  function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    let saved;
    try { saved = localStorage.getItem('theme'); } catch (error) {}
    const isDark = saved ? saved === 'dark' : !window.matchMedia('(prefers-color-scheme: light)').matches;
    document.body.classList.toggle('dark-mode', isDark);
    toggle.setAttribute('aria-checked', String(isDark));
    toggle.addEventListener('click', () => {
      const next = toggle.getAttribute('aria-checked') !== 'true';
      document.body.classList.toggle('dark-mode', next);
      toggle.setAttribute('aria-checked', String(next));
      try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch (error) {}
    });
  }

  function renderAssets() {
    const body = document.getElementById('asset-table-body');
    if (!body) return;
    const filters = document.getElementById('asset-filters');
    const search = document.getElementById('asset-search');
    const manufacturer = document.getElementById('manufacturer-filter');
    const office = document.getElementById('office-filter');
    const status = document.getElementById('status-filter');
    const count = document.getElementById('asset-count');
    const populate = (select, values, label) => {
      const current = select.value;
      select.innerHTML = `<option value="">${label}</option>${values.map((value) => `<option>${escapeHtml(value)}</option>`).join('')}`;
      if (values.includes(current)) select.value = current;
    };
    const assets = getAssets();
    populate(manufacturer, [...new Set(assets.map((asset) => asset.manufacturer))].sort(), 'All manufacturers');
    populate(office, [...new Set(employees.map((employee) => employee.office))].sort(), 'All offices');
    const queryStatus = new URLSearchParams(window.location.search).get('status');
    if (queryStatus === 'assigned') status.value = 'assigned';
    if (queryStatus === 'available') status.value = 'storage';

    function update() {
      const query = search.value.trim().toLowerCase();
      const results = assets.filter((asset) => {
        const assignment = getAssignment(asset);
        const employee = getEmployee(assignment.employeeId);
        const assetStatus = employee ? 'assigned' : 'storage';
        const searchable = `${asset.tag} ${asset.manufacturer} ${asset.model} ${employee?.name || ''}`.toLowerCase();
        return (!query || searchable.includes(query))
          && (!manufacturer.value || asset.manufacturer === manufacturer.value)
          && (!office.value || employee?.office === office.value)
          && (!status.value || assetStatus === status.value);
      });
      count.textContent = `${results.length} of ${assets.length} assets`;
      body.innerHTML = results.length ? results.map((asset) => {
        const assignment = getAssignment(asset);
        const employee = getEmployee(assignment.employeeId);
        const warranty = getWarranty(asset.warrantyExpiry);
        return `<tr>
          <td data-label="Asset"><span class="asset-code">${escapeHtml(asset.tag)}</span><small class="asset-category">${escapeHtml(asset.type)}</small></td>
          <td data-label="Make / model"><span class="asset-item">${escapeHtml(asset.manufacturer)} ${escapeHtml(asset.model)}</span></td>
          <td data-label="Assigned to">${employee ? `<a class="employee-link" href="emp_mock.html?employee=${encodeURIComponent(employee.id)}">${escapeHtml(employee.name)}</a>` : '<span class="muted-value">In storage</span>'}</td>
          <td data-label="Office">${escapeHtml(employee?.office || '—')}</td>
          <td data-label="Purchase date"><time datetime="${escapeHtml(asset.purchaseDate)}">${formatDate(asset.purchaseDate)}</time></td>
          <td data-label="Warranty expires"><time datetime="${escapeHtml(asset.warrantyExpiry)}">${formatDate(asset.warrantyExpiry)}</time><small class="warranty-label ${warranty.className}">${warranty.label}</small></td>
          <td data-label="Status"><span class="status-badge ${employee ? 'status-active' : 'status-storage'}">${employee ? 'Assigned' : 'In storage'}</span></td>
          <td data-label="Action"><a class="table-action" href="assign-asset.html?asset=${encodeURIComponent(asset.tag)}">${employee ? 'Reassign' : 'Assign'}</a></td>
        </tr>`;
      }).join('') : '<tr><td colspan="8" class="empty-state">No assets match these filters.</td></tr>';
    }

    filters.addEventListener('input', update);
    filters.addEventListener('change', update);
    filters.addEventListener('reset', () => window.setTimeout(update, 0));
    search.value = new URLSearchParams(window.location.search).get('search') || '';
    update();
  }

  function renderEmployee() {
    const profile = document.getElementById('employee-profile');
    if (!profile) return;
    const requestedId = new URLSearchParams(window.location.search).get('employee') || 'adel-ahmed';
    const employee = getEmployee(requestedId) || employees[0];
    document.getElementById('employee-name').textContent = employee.name;
    document.getElementById('employee-title').textContent = employee.title;
    document.getElementById('employee-department').textContent = employee.department;
    document.getElementById('employee-office').textContent = employee.office;
    document.getElementById('employee-number').textContent = employee.number;
    document.getElementById('employee-avatar').textContent = employee.name.split(' ').map((part) => part[0]).join('').slice(0, 2);
    document.getElementById('employee-profile-link').href = `assets.html?search=${encodeURIComponent(employee.name)}`;
    const assigned = getAssets().filter((asset) => getAssignment(asset).employeeId === employee.id);
    document.getElementById('assigned-device-count').textContent = `${assigned.length} ${assigned.length === 1 ? 'device' : 'devices'}`;
    document.getElementById('employee-assets').innerHTML = assigned.length ? assigned.map((asset) => {
      const warranty = getWarranty(asset.warrantyExpiry);
      return `<tr><td data-label="Asset tag"><span class="asset-code">${escapeHtml(asset.tag)}</span></td><td data-label="Make / model"><span class="asset-item">${escapeHtml(asset.manufacturer)} ${escapeHtml(asset.model)}</span><small class="asset-category">${escapeHtml(asset.type)}</small></td><td data-label="Purchase date"><time datetime="${escapeHtml(asset.purchaseDate)}">${formatDate(asset.purchaseDate)}</time></td><td data-label="Warranty expires"><time datetime="${escapeHtml(asset.warrantyExpiry)}">${formatDate(asset.warrantyExpiry)}</time><small class="warranty-label ${warranty.className}">${warranty.label}</small></td><td data-label="Status"><span class="status-badge status-active">Assigned</span></td></tr>`;
    }).join('') : '<tr><td colspan="5" class="empty-state">No devices are currently assigned.</td></tr>';
  }

  function renderAssignmentForm() {
    const form = document.getElementById('assignment-form');
    if (!form) return;
    const assetSelect = document.getElementById('existing-asset');
    const employeeSelect = document.getElementById('assignee');
    const newEmployee = document.getElementById('new-assignee');
    const assetOptions = getAssets().map((asset) => {
      const employee = getEmployee(getAssignment(asset).employeeId);
      return `<option value="${escapeHtml(asset.tag)}">${escapeHtml(asset.tag)} · ${escapeHtml(asset.manufacturer)} ${escapeHtml(asset.model)}${employee ? ` · ${escapeHtml(employee.name)}` : ' · In storage'}</option>`;
    }).join('');
    const employeeOptions = `<option value="">Keep in storage</option>${employees.map((employee) => `<option value="${employee.id}">${escapeHtml(employee.name)} · ${escapeHtml(employee.office)}</option>`).join('')}`;
    assetSelect.innerHTML = `<option value="">Select an asset</option>${assetOptions}`;
    employeeSelect.innerHTML = employeeOptions;
    newEmployee.innerHTML = employeeOptions;
    const requestedTag = new URLSearchParams(window.location.search).get('asset') || '';
    const requestedEmployee = new URLSearchParams(window.location.search).get('employee') || '';
    if (requestedTag) {
      assetSelect.value = requestedTag;
      const asset = getAssets().find((item) => item.tag === requestedTag);
      if (asset) employeeSelect.value = getAssignment(asset).employeeId;
    }
    if (requestedEmployee) newEmployee.value = requestedEmployee;

    const today = new Date();
    document.getElementById('assignment-date').value = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const existingFields = document.getElementById('existing-fields');
    const purchaseFields = document.getElementById('purchase-fields');
    const dateField = document.getElementById('assignment-date-field');
    const setMode = () => {
      const isNew = document.querySelector('input[name="form-mode"]:checked').value === 'new';
      existingFields.hidden = isNew;
      purchaseFields.hidden = !isNew;
      assetSelect.required = !isNew;
      employeeSelect.required = false;
      purchaseFields.querySelectorAll('[data-required="true"]').forEach((input) => { input.required = isNew; });
      newEmployee.disabled = !isNew;
      dateField.hidden = isNew ? !newEmployee.value : !employeeSelect.value;
      document.getElementById('assignment-date').required = !dateField.hidden;
      document.getElementById('save-assignment').textContent = isNew ? 'Register purchase' : 'Save assignment';
    };
    document.querySelectorAll('input[name="form-mode"]').forEach((input) => input.addEventListener('change', setMode));
    if (new URLSearchParams(window.location.search).get('mode') === 'new') document.getElementById('mode-purchase').checked = true;
    setMode();
    assetSelect.addEventListener('change', () => {
      const asset = getAssets().find((item) => item.tag === assetSelect.value);
      employeeSelect.value = asset ? getAssignment(asset).employeeId : '';
      setMode();
    });
    employeeSelect.addEventListener('change', setMode);
    newEmployee.addEventListener('change', setMode);
    document.getElementById('purchase-date').addEventListener('change', (event) => { document.getElementById('warranty-date').min = event.target.value; });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const isNew = document.querySelector('input[name="form-mode"]:checked').value === 'new';
      let saved;
      let generatedTag = '';
      if (isNew) {
        const purchaseDate = document.getElementById('purchase-date').value;
        const warrantyExpiry = document.getElementById('warranty-date').value;
        if (warrantyExpiry < purchaseDate) {
          document.getElementById('warranty-date').setCustomValidity('Warranty expiry must be on or after the purchase date.');
          document.getElementById('warranty-date').reportValidity();
          document.getElementById('warranty-date').setCustomValidity('');
          return;
        }
        const assets = getAssets();
        const nextNumber = assets.reduce((highest, asset) => Math.max(highest, Number(asset.tag.match(/\d+$/)?.[0] || 0)), 0) + 1;
        const asset = {
          tag: `AST-${String(nextNumber).padStart(4, '0')}`,
          manufacturer: document.getElementById('new-manufacturer').value,
          model: document.getElementById('new-model').value.trim(),
          type: document.getElementById('new-type').value,
          purchaseDate,
          warrantyExpiry,
          employeeId: '',
          assignedDate: ''
        };
        generatedTag = asset.tag;
        const additions = readStorage(newAssetsKey, []);
        additions.push(asset);
        saved = writeStorage(newAssetsKey, additions);
        if (saved) document.getElementById('new-asset-tag').value = asset.tag;
        if (saved && newEmployee.value) saved = saveAssignment(asset.tag, newEmployee.value, document.getElementById('assignment-date').value);
      } else {
        saved = saveAssignment(assetSelect.value, employeeSelect.value, document.getElementById('assignment-date').value);
      }
      const message = document.getElementById('form-message');
      message.textContent = saved ? `${generatedTag ? `Registered ${generatedTag}. ` : ''}Saved in this browser prototype. No server or database was contacted.` : 'This browser could not save the demo change.';
      message.classList.toggle('message-error', !saved);
      message.focus();
    });
  }

  function renderDashboard() {
    const table = document.getElementById('recent-assignments');
    if (!table) return;
    const assets = getAssets();
    const assigned = assets.map((asset) => ({ asset, assignment: getAssignment(asset) })).filter(({ assignment }) => assignment.employeeId);
    const available = assets.length - assigned.length;
    const officeCount = new Set(assigned.map(({ assignment }) => getEmployee(assignment.employeeId)?.office).filter(Boolean)).size;
    const setText = (id, value) => { document.getElementById(id).textContent = String(value); };
    setText('dashboard-employees', employees.length);
    setText('dashboard-assets', assets.length);
    setText('dashboard-assigned', assigned.length);
    setText('dashboard-available', available);
    setText('dashboard-offices', `${officeCount} offices represented`);
    setText('legend-assigned', assigned.length);
    setText('legend-storage', available);
    setText('dashboard-total', `${assets.length} total devices`);
    const assignedPercent = assets.length ? (assigned.length / assets.length) * 100 : 0;
    document.getElementById('meter-assigned').style.width = `${assignedPercent}%`;
    document.getElementById('meter-storage').style.width = `${100 - assignedPercent}%`;
    document.querySelector('.assignment-meter').setAttribute('aria-label', `${assigned.length} of ${assets.length} assets assigned`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const watch = assets.map((asset) => ({ asset, days: Math.ceil((new Date(`${asset.warrantyExpiry}T00:00:00`) - today) / 86400000) }))
      .filter(({ days }) => days <= 30)
      .sort((first, second) => first.days - second.days)
      .slice(0, 3);
    setText('warranty-count', watch.length ? `${watch.length} item${watch.length === 1 ? '' : 's'} ${watch.length === 1 ? 'needs' : 'need'} attention` : 'No urgent expirations');
    document.getElementById('warranty-list').innerHTML = watch.length ? watch.map(({ asset, days }) => `
      <li><span class="warranty-state ${days < 0 ? 'is-expired' : 'is-due'}">${days < 0 ? 'Expired' : `Due in ${days} days`}</span><a href="assets.html?search=${encodeURIComponent(asset.tag)}"><strong>${escapeHtml(asset.model)}</strong><small>${escapeHtml(asset.tag)} · ${formatDate(asset.warrantyExpiry)}</small></a></li>`).join('') : '<li class="watch-empty">No warranties due in the next 30 days.</li>';
    const recent = [...assigned].sort((a, b) => (b.assignment.assignedDate || '').localeCompare(a.assignment.assignedDate || '')).slice(0, 5);
    setText('dashboard-recent-count', `${recent.length} recent assignments`);
    table.innerHTML = recent.map(({ asset, assignment }) => {
      const employee = getEmployee(assignment.employeeId);
      const initials = employee.name.split(' ').map((part) => part[0]).join('').slice(0, 2);
      return `<tr><td><a class="employee-table-link" href="emp_mock.html?employee=${encodeURIComponent(employee.id)}"><span class="employee-avatar avatar" aria-hidden="true">${initials}</span><span>${escapeHtml(employee.name)}<small>${escapeHtml(employee.department)}</small></span></a></td><td>${escapeHtml(asset.manufacturer)} ${escapeHtml(asset.model)}</td><td><span class="asset-code">${escapeHtml(asset.tag)}</span></td><td><time datetime="${escapeHtml(assignment.assignedDate)}">${formatDate(assignment.assignedDate)}</time></td><td><span class="status-badge status-active">Assigned</span></td></tr>`;
    }).join('');
  }

  window.CorpGear = { getAssets, getEmployees, getEmployee, getAssignment, formatDate, getWarranty };
  initTheme();
  renderAssets();
  renderEmployee();
  renderAssignmentForm();
  renderDashboard();
})();