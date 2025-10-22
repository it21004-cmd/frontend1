import React from "react";

function ProfileEdit() {
  return (
    <form>
      <label>
        Profile Picture:
        <input type="file" name="profilePic" />
      </label>
      <br />
      <label>
        Cover Photo:
        <input type="file" name="coverPhoto" />
      </label>
      <br />
      <button type="submit">Save</button>
    </form>
  );
}

export default ProfileEdit;