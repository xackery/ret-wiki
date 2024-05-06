---
title: "Zone Guide"
images: [zone-guide.png]
weight: 3
description: "Discover how to get from zone A to B."
---

![Zone Guide](images/zoneguide.png)

{{<rawhtml>}}
<div class="container">
  <form action="" id="searchForm">
    <h1>Search For Zone Links</h1>
    <input type="checkbox" id="areWizardPortsEnabled" name="areWizardPortsEnabled">
    <label for="areWizardPortsEnabled">Wizard Ports</label>
    <input type="checkbox" id="areDruidPortsEnabled" name="areDruidPortsEnabled">
    <label for="areDruidPortsEnabled">Druid Ports</label>
    <br>
    <input type="checkbox" id="isGuildLobbyAAEnabled" name="isGuildLobbyAAEnabled">
    <label for="isGuildLobbyAAEnabled">Guild Lobby AA</label>
    <input type="checkbox" id="areGuildLobbyPortsEnabled" name="areGuildLobbyPortsEnabled">
    <label for="areGuildLobbyPortsEnabled">Guild Lobby Ports</label>
    <br>

    From:
    <input list="zones" name="from" id="from">
    To:
    <input list="zones" name="to" id="to">
  <datalist id="zones">
  </datalist>
    <button type="submit">Submit</button>
  </form>
    <div id="results"></div>
</div>
<script src="zone-guide.js"></script>
{{</rawhtml>}}


