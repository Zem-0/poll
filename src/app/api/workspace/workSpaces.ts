import axios from "axios";

async function GetAllWorkspaces(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/get_workspaces`,
      {
        headers: {
          "Content-Type": "application/json",
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: access_token,
        }
      }
    );
    return response;
  } catch (e) {
    console.log(e);
  }
}

async function CreateWorkspace(access_token: string, workspace_name: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/insert_workspace?workspace=${encodeURIComponent(workspace_name)}`,
      null, // No body needed
      {
        headers: {
          "Content-Type": "application/json",
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          JWTToken: access_token,
        },
      }
    );
    return response;
  } catch (e) {
    console.error("Error creating workspace:", e);
    throw e;
  }
}

async function DeleteWorkspace(access_token: string, workspaceId: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/deleteworkspace`,
      JSON.stringify({ workspace: workspaceId }), // Stringify the payload
      {
        headers: {
          'APISECRET': process.env.NEXT_PUBLIC_APISECRET,
          'JWTToken': access_token,
          'Content-Type': 'application/json', 
        },
      }
    );
    return response;
  } catch (e) {
    console.error("Error during workspace deletion:", e);
    throw e;
  }
}

export { GetAllWorkspaces, CreateWorkspace, DeleteWorkspace };
