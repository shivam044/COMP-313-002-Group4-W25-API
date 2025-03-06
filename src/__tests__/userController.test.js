import userController from "../controllers/userController.js";
import User from "../models/user.js";
jest.mock("../models/user.js");

const { createUser, getUserById, deleteUser } = userController;

describe("createUser Controller", () => {
    it("should create a user and return 201 status", async () => {
        User.create.mockResolvedValueOnce({
          _id: "672edc5b771be88704250ae8",
          userName: "shivam044",
          firstName: "Shivam",
          lastName: "Ujjainwal",
          email: "shivam.jobs056@gmail.com",
          password: "password123",
          role: "student",
          created_at: "2024-11-09T03:51:55.937Z",
          updated_at: "2024-11-09T03:51:55.937Z",
        });
      
        const req = {
          body: {
            userName: "shivam044",
            firstName: "Shivam",
            lastName: "Ujjainwal",
            email: "shivam.jobs056@gmail.com",
            password: "password123",
            role: "student",
          },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        await createUser(req, res);
      
        expect(res.status).toHaveBeenCalledWith(201);
      });

  it("should return 400 if email is already in use", async () => {
    User.findOne.mockResolvedValue({ email: "johndoe@example.com" });

    const req = {
      body: { email: "johndoe@example.com", password: "password123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email already in use" });
  });

  it("should return 500 if there is a server error", async () => {
    // Mock User.findOne to simulate that no existing user is found
    User.findOne.mockResolvedValueOnce(null);
  
    // Mock User.create to throw an error
    User.create.mockRejectedValueOnce(new Error("Database error"));
  
    const req = {
      body: {
        userName: "johndoe",
        firstName: "John",
        lastName: "Doe",
        role: "student",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await createUser(req, res);
  
    // Assert the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error creating user",
      error: "Illegal arguments: undefined, number",
    });
  });
});

describe("getUserById Controller", () => {
    it("should return user data and status 200 when the user is found", async () => {
      User.findById.mockResolvedValueOnce({
        _id: "672edc5b771be88704250ae8",
        userName: "shivam044",
        firstName: "Shivam",
        lastName: "Ujjainwal",
        email: "shivam.jobs056@gmail.com",
        role: "student",
      });
  
      const req = { params: { id: "672edc5b771be88704250ae8" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await getUserById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        _id: "672edc5b771be88704250ae8",
        userName: "shivam044",
        firstName: "Shivam",
        lastName: "Ujjainwal",
        email: "shivam.jobs056@gmail.com",
        role: "student",
      });
    });
  
    it("should return 404 if the user is not found", async () => {
      User.findById.mockResolvedValueOnce(null);
  
      const req = { params: { id: "nonexistent-id" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await getUserById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });
  
  describe("deleteUser Controller", () => {
    it("should delete the user and return 200 status", async () => {
      User.findByIdAndDelete.mockResolvedValueOnce({
        _id: "672edc5b771be88704250ae8",
        userName: "shivam044",
      });
  
      const req = { params: { id: "672edc5b771be88704250ae8" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await deleteUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
    });
  
    it("should return 404 if the user is not found", async () => {
      User.findByIdAndDelete.mockResolvedValueOnce(null);
  
      const req = { params: { id: "nonexistent-id" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await deleteUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });



