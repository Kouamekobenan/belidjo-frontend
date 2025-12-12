import { useState } from "react";
import { ProductRepository } from "../../infrastructure/product-repository";
import { ProductMapper } from "../../domain/mappers/product.mapper";
import toast from "react-hot-toast";
const catRepo = new ProductRepository(new ProductMapper());

export const deleteProductUseCase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await catRepo.delete(id);
      toast.success("Produit supprimer avec succès!");
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { handleDelete, loading, error };
};
